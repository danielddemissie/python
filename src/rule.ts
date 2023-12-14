import { getRules } from "./rules";
import { CompositeF, Condition, Rule, RuleResult } from "./types";

export default class RuleEngine {
  constructor() {}

  async loadRules() {
    let rules: Rule[] = [];
    rules = await getRules();

    return rules;
  }

  validateRule(rule: Rule) {
    const required_keys = [
      "name",
      "composite_flag_conditions",
      "composite_false_positives",
    ];
    // check if required keys are present
    for (const key of required_keys) {
      if (!(key in rule)) {
        throw new Error(`Rule is missing required key ${key}`);
      }
    }

    // composite_flag_conditions and  composite_false_positives are arrays
    if (
      !Array.isArray(rule.composite_flag_conditions) ||
      !Array.isArray(rule.composite_false_positives)
    ) {
      throw new Error(
        `composite_flag_conditions and composite_false_positive must be an array`
      );
    }

    for (const composite of [
      ...rule.composite_flag_conditions,
      ...rule.composite_false_positives,
    ]) {
      if (!("logical_operator" in composite && "conditions" in composite)) {
        throw new Error(
          `composite_flag_conditions and composite_false_positive must have logical_operator and conditions`
        );
      }
    }

    // conditions is an array
    for (const composite of [
      ...rule.composite_flag_conditions,
      ...rule.composite_false_positives,
    ]) {
      for (const condition of composite.conditions) {
        if (
          !(
            "attribute" in condition &&
            "operator" in condition &&
            "value" in condition
          )
        ) {
          throw new Error(`condition must have attribute, operator, and value`);
        }
      }
    }
  }

  async checkWebsite(website: any): Promise<RuleResult> {
    const rules = await this.loadRules();
    for (const rule of rules) {
      if (this.matchRules(website, rule).matchedRule) {
        return this.matchRules(website, rule);
      }
    }

    return {
      status: "unknown",
      matchedRule: null,
    };
  }

  matchRules(website: any, rule: Rule): RuleResult {
    // false positive
    if (
      rule.composite_false_positives.length > 0 &&
      this.matchCompositeConditionRules(website, rule.composite_false_positives)
    ) {
      console.log("MATCHED FALSE POSITIVE SITE");
      return {
        status: "false_positive",
        matchedRule: rule,
      };
    }

    // flagged safe
    if (
      this.matchCompositeConditionRules(website, rule.composite_flag_conditions)
    ) {
      console.log("MATCHED FLAGGED SITE");
      return {
        status: "flagged",
        matchedRule: rule,
      };
    }

    return {
      status: "unknown",
      matchedRule: null,
    };
  }

  matchCompositeConditionRules(
    website: any,
    composite_conditions: CompositeF[]
  ) {
    for (const composite of composite_conditions) {
      const logical_operator = composite.logical_operator;
      const conditions = composite.conditions;

      if (conditions.length == 0) {
        continue;
      }
      if (logical_operator == "and") {
        if (
          conditions.every((condition) =>
            this.matchCondition(website, condition)
          )
        ) {
          return true;
        }
      } else if (logical_operator == "or") {
        if (
          conditions.some((condition) =>
            this.matchCondition(website, condition)
          )
        ) {
          return true;
        }
      }
      return false;
    }
  }

  matchCondition(website: any, condition: Condition): boolean {
    const attribute = condition.attribute;
    const operator = condition.operator;
    const case_sensitive = condition?.case_sensitive ?? true;

    let value = condition.value;
    let website_value: string = "";

    try {
      website_value = website[attribute];
    } catch (error) {
      throw new Error(
        `Error getting attribute ${attribute} from website: ${error}`
      );
    }

    if (!case_sensitive) {
      value = value.toLowerCase();
      website_value = website_value?.toLowerCase();
    }

    if (operator == "contains") {
      return website_value?.includes(value);
    } else if (operator == "starts_with") {
      return website_value?.startsWith(value);
    } else if (operator == "ends_with") {
      return website_value?.endsWith(value);
    } else if (operator == "not_contains") {
      return !website_value?.includes(value);
    } else if (operator == "length_greater_than") {
      return website_value?.length > +value;
    } else if (operator == "length_less_than") {
      return website_value?.length < +value;
    }

    return false;
  }
}

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
      if (this.matchRules(website, rule)) {
        return {
          status: true,
          rule: rule,
        };
      }
    }

    return {
      status: false,
      rule: null,
    };
  }

  matchRules(website: any, rule: Rule): boolean {
    // match website against rule
    if (
      this.matchCompositeConditionRules(website, rule.composite_flag_conditions)
    ) {
      return true;
    }
    if (
      this.matchCompositeConditionRules(website, rule.composite_false_positives)
    ) {
      return false;
    }
    return false;
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
        for (const condition of conditions) {
          if (!this.matchCondition(website, condition)) {
            return false;
          }

          return true;
        }
      } else if (logical_operator == "or") {
        for (const condition of conditions) {
          if (this.matchCondition(website, condition)) {
            return true;
          }
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

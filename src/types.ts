export interface Rule {
  ruleID: string;
  name: string;
  authorName: string;
  description: string;
  meta: string;
  target: string;
  composite_flag_conditions: CompositeF[];
  composite_false_positives: CompositeF[];
}

export interface CompositeF {
  logical_operator: string;
  conditions: Condition[];
}

export interface Condition {
  attribute: string;
  operator: string;
  value: string;
  case_sensitive?: boolean;
}

export interface Website {
  html: string[];
  url: string[];
  buttons: string[];
  text: string[];
  links: string[];
  scripts: string[];
  title: string[];
  forms: string[];
  images: string[];
  jsLibs: string[];
}

export interface RuleResult {
  status: boolean;
  rule: Rule | null;
}

import type { categories } from "./categories";

export interface ConditionType {
  category?: keyof typeof categories;
  description: string;
}

export const conditions = {
  EQ: {
    category: "condition",
    description: "Equal (Zero == 1)",
  },
  NE: {
    category: "condition",
    description: "Not Equal (Zero == 0)",
  },
  GE: {
    category: "condition",
    description: "Greater or Equal (Carry == 1)",
  },
  LT: {
    category: "condition",
    description: "Less Than (Carry == 0)",
  },
};

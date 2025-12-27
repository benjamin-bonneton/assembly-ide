export interface CategoryType {
  name: string;
  color: string;
}

export const categories: Record<string, CategoryType> = {
  execution: {
    name: "Execution",
    color: "var(--syntax-execution)",
  },
  operations: {
    name: "Operations",
    color: "var(--syntax-operations)",
  },
  memory: {
    name: "Memory",
    color: "var(--syntax-memory)",
  },
  control: {
    name: "Control",
    color: "var(--syntax-control)",
  },
  storage: {
    name: "Storage",
    color: "var(--syntax-storage)",
  },
  register: {
    name: "Register",
    color: "var(--syntax-register)",
  },
  comment: {
    name: "Comment",
    color: "var(--syntax-comment)",
  },
  define: {
    name: "Define",
    color: "var(--syntax-define)",
  },
  condition: {
    name: "Condition",
    color: "var(--syntax-condition)",
  },
};

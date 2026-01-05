export interface ValidationRule {
  validate(value: any, data: Record<string, any>): boolean;
  message(field: string, value: any): string;
}

export interface ValidationErrors {
  [field: string]: string[];
}

export class Validator {
  private errors: ValidationErrors = {};
  private data: Record<string, any>;
  private rules: Record<string, string[]>;
  private customMessages: Record<string, string> = {};

  constructor(data: Record<string, any>, rules: Record<string, string[]>, messages: Record<string, string> = {}) {
    this.data = data;
    this.rules = rules;
    this.customMessages = messages;
  }

  async validate(): Promise<boolean> {
    this.errors = {};

    for (const [field, fieldRules] of Object.entries(this.rules)) {
      const value = this.data[field];

      for (const ruleString of fieldRules) {
        const [ruleName, ...params] = ruleString.split(':');
        const rule = this.getRule(ruleName, params);

        if (rule && !rule.validate(value, this.data)) {
          if (!this.errors[field]) {
            this.errors[field] = [];
          }
          
          const messageKey = `${field}.${ruleName}`;
          const message = this.customMessages[messageKey] || rule.message(field, value);
          this.errors[field].push(message);
        }
      }
    }

    return Object.keys(this.errors).length === 0;
  }

  fails(): boolean {
    return Object.keys(this.errors).length > 0;
  }

  passes(): boolean {
    return !this.fails();
  }

  getErrors(): ValidationErrors {
    return this.errors;
  }

  private getRule(name: string, params: string[]): ValidationRule | null {
    const rules: Record<string, (params: string[]) => ValidationRule> = {
      required: () => ({
        validate: (value) => value !== undefined && value !== null && value !== '',
        message: (field) => `The ${field} field is required.`
      }),
      
      email: () => ({
        validate: (value) => {
          if (!value) return true;
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: (field) => `The ${field} must be a valid email address.`
      }),
      
      min: (params) => ({
        validate: (value) => {
          if (!value) return true;
          const min = parseInt(params[0]);
          if (typeof value === 'number' || !isNaN(Number(value))) {
            return Number(value) >= min;
          }
          if (typeof value === 'string') return value.length >= min;
          return true;
        },
        message: (field, value) => {
          const min = params[0];
          if (typeof value === 'number' || !isNaN(Number(value))) {
            return `The ${field} must be at least ${min}.`;
          }
          return `The ${field} must be at least ${min} characters.`;
        }
      }),
      
      max: (params) => ({
        validate: (value) => {
          if (!value) return true;
          const max = parseInt(params[0]);
          if (typeof value === 'number' || !isNaN(Number(value))) {
            return Number(value) <= max;
          }
          if (typeof value === 'string') return value.length <= max;
          return true;
        },
        message: (field, value) => {
          const max = params[0];
          if (typeof value === 'number' || !isNaN(Number(value))) {
            return `The ${field} must not exceed ${max}.`;
          }
          return `The ${field} must not exceed ${max} characters.`;
        }
      }),
      
      numeric: () => ({
        validate: (value) => {
          if (!value) return true;
          return !isNaN(Number(value));
        },
        message: (field) => `The ${field} must be a number.`
      }),
      
      string: () => ({
        validate: (value) => {
          if (!value) return true;
          return typeof value === 'string';
        },
        message: (field) => `The ${field} must be a string.`
      }),
      
      confirmed: () => ({
        validate: (value, data) => {
          const field = Object.keys(this.rules).find(k => this.rules[k].includes('confirmed'));
          if (!field) return true;
          return value === data[`${field}_confirmation`];
        },
        message: (field) => `The ${field} confirmation does not match.`
      }),
      
      in: (params) => ({
        validate: (value) => {
          if (!value) return true;
          return params.includes(String(value));
        },
        message: (field) => `The selected ${field} is invalid.`
      }),
      
      url: () => ({
        validate: (value) => {
          if (!value) return true;
          const urlRegex = /^https?:\/\/.+/;
          return urlRegex.test(value);
        },
        message: (field) => `The ${field} must be a valid URL.`
      }),
      
      alpha: () => ({
        validate: (value) => {
          if (!value) return true;
          return /^[a-zA-Z]+$/.test(value);
        },
        message: (field) => `The ${field} may only contain letters.`
      }),
      
      alphanumeric: () => ({
        validate: (value) => {
          if (!value) return true;
          return /^[a-zA-Z0-9]+$/.test(value);
        },
        message: (field) => `The ${field} may only contain letters and numbers.`
      })
    };

    const ruleFactory = rules[name];
    return ruleFactory ? ruleFactory(params) : null;
  }
}

export function validate(data: Record<string, any>, rules: Record<string, string[]>, messages: Record<string, string> = {}): Validator {
  const validator = new Validator(data, rules, messages);
  return validator;
}

import { ValidationErrorItem } from "@hapi/joi";

export class ConfigValidationError extends Error {
  constructor(fileName: string, details: ValidationErrorItem[]) {
    super(
      [
        `error validating config schema in '${fileName}':`,
        ...details.map((detail) => detail.message),
      ].join("\n")
    );
    this.name = "ConfigValidationError";
  }
}

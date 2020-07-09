export class ConfigValidationError extends Error {
  constructor(fileName: string) {
    super(`error validating config schema in '${fileName}'`);
    this.name = "ConfigValidationError";
  }
}

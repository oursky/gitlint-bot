import path from "path";
import fs from "fs";

const configTemplate = `preset: default
rules:
  body-max-line-length: [on, null, 80]
  body-no-trailing-whitespace: [on]
  subject-capitalize-first: [on]
  subject-max-length: [on, null, 80]
  subject-min-length: [on, null, 10]
  subject-no-hard-tab: [on]
  subject-no-trailing-punctuation: [on]
  subject-no-trailing-whitespace: [on]
`;

const configFileName = ".gitlintrc";

function generateConfig(): void {
  const destFilePath = path.resolve("./", configFileName);
  fs.writeFileSync(destFilePath, configTemplate);
  console.log("Successfully created config file at: " + destFilePath);
}

export default generateConfig;

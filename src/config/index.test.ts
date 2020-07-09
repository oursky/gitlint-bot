import { Octokit } from "probot";
import { getConfigFromGithub } from "./";
import { defaultPreset } from "../lint/presets";
import * as loader from "./loader";

const client = new Octokit();
const sampleRepoName = "oursky/gitlint-bot";
const masterRef = "refs/heads/master";

describe("'getConfigFromGithub' function", () => {
  describe("when repository full name is invalid", () => {
    it("should return the default preset", async () => {
      const emptyString = await getConfigFromGithub(client, "", masterRef);
      const noSlash = await getConfigFromGithub(client, "test", masterRef);
      expect(emptyString).toEqual(defaultPreset);
      expect(noSlash).toEqual(noSlash);
    });
  });

  describe("when loaded config is invalid", () => {
    it("should return the default preset", async () => {
      const mock = jest.spyOn(loader, "loadConfigFromGithub");
      const invalidReturns = [
        null,
        {
          a: 1,
          b: 1,
        },
        {
          preset: "default",
          rules: null,
        },
        {
          preset: "default",
          rules: {
            "sample-rule": [],
          },
        },
      ];
      for (const invalidReturn of invalidReturns) {
        mock.mockReturnValue(Promise.resolve(invalidReturn));
        const config = await getConfigFromGithub(
          client,
          sampleRepoName,
          masterRef
        );
        expect(config).toEqual(defaultPreset);
      }
    });
  });

  describe("when loaded config has an empty rule map", () => {
    it("should return the default preset", async () => {
      const mock = jest.spyOn(loader, "loadConfigFromGithub");
      mock.mockReturnValue(
        Promise.resolve({
          preset: "default",
          rules: {},
        })
      );
      const config = await getConfigFromGithub(
        client,
        sampleRepoName,
        masterRef
      );
      expect(config).toEqual(defaultPreset);
    });
  });

  describe("when loaded config modifies existing rules in default preset", () => {
    it("should merge modifications with default preset", async () => {
      const mock = jest.spyOn(loader, "loadConfigFromGithub");
      mock.mockReturnValue(
        Promise.resolve({
          preset: "default",
          rules: {
            "body-max-line-length": ["off"],
            "subject-max-length": ["on", 100, 100],
          },
        })
      );
      const config = await getConfigFromGithub(
        client,
        sampleRepoName,
        masterRef
      );
      expect(config).toEqual({
        ...defaultPreset,
        "body-max-line-length": ["off", null, 80],
        "subject-max-length": ["on", 100, 100],
      });
    });
  });

  describe("when loaded config adds rules not in default preset", () => {
    it("should merge default preset rules with new rules", async () => {
      const newRules = {
        "my-new-rule": ["on", 5, 200, 200],
        "my-new-rule-2": ["on", 100, 100],
      };
      const mock = jest.spyOn(loader, "loadConfigFromGithub");
      mock.mockReturnValue(
        Promise.resolve({
          preset: "default",
          rules: newRules,
        })
      );
      const config = await getConfigFromGithub(
        client,
        sampleRepoName,
        masterRef
      );
      expect(config).toEqual({
        ...defaultPreset,
        ...newRules,
      });
    });
  });
});

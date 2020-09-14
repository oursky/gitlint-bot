import { parseCommit } from "./parser";

describe("'parseCommit' function", () => {
  describe("when an no header regex is provided", () => {
    it("should use default conventional commit regex", async () => {
      const commit = await parseCommit("fix: Use correct header regex", {
        headerPattern: undefined,
        rules: {},
      });
      expect(commit.header).toEqual("fix: Use correct header regex");
      expect(commit.type).toEqual("fix");
      expect(commit.subject).toEqual("Use correct header regex");
    });
  });
  describe("when an header regex is provided", () => {
    it("should use provided regex", async () => {
      const commit = await parseCommit("fix: Use correct header regex", {
        headerPattern: /^()()(.*)$/,
        rules: {},
      });
      expect(commit.header).toEqual("fix: Use correct header regex");
      expect(commit.type).toBeNull();
      expect(commit.subject).toEqual("fix: Use correct header regex");
    });
  });
});

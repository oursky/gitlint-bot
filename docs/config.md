# Configuring gitlint-bot

gitlint-bot lets you control the rules used to analyze commit messages via a configuration file.

## Configuration File

gitlint-bot expects configuration files to be written in YAML with a filename of `.gitlintrc`.

Look at [.gitlintrc.example](./.gitlintrc.example) for an example config file.

### preset

Specifies the rule preset to use.

**Type:** `string`

**Options:** `default`

**Default:** `default`

### rules

Mapping of rule-names to rule configurations.

**Type:** `Record<string, RuleConfig>`

**Default:** `{}`

Here is the type definition for `RuleConfig`:

```typescript
type RuleLevel = "on" | "off";
type RuleScore = number | null;
type RuleArgs = any;

type RuleConfig = [RuleLevel?, RuleScore?, RuleArgs?];
```

- `RuleLevel`: Enables the rule when set to "on", otherwise disables it.
- `RuleScore`: Sets the rule violation score when a number is passed. Uses the default rule score when omitted or if `null` is passed.
- `RuleArgs`: Arguments used to customize the rule.

module.exports = {
  // add your custom config here
  // https://stylelint.io/user-guide/configuration

  "rules": {
    "block-no-empty": null,
    "color-no-invalid-hex": null,
    "comment-empty-line-before": [ "always", {
      "ignore": ["stylelint-commands", "after-comment"]
    } ],
    "declaration-colon-space-after": "always",
    "indentation": [ 2, {
      "except": ["value"]
    }],
    "max-empty-lines": 2,
    "rule-empty-line-before": [ "always", {
      "except": ["first-nested"],
      "ignore": ["after-comment"]
    } ],
    // "unit-whitelist": ["em", "rem", "%", "s"]
  }
}

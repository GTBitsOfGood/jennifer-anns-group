module.exports = {
  extends: ["next", "next/core-web-vitals", "plugin:prettier/recommended"],
  // Can't commit on Windows systems with CRLF without this rule
  rules: {
    "prettier/prettier": ["error", { endOfLine: "auto" }],
  },
};

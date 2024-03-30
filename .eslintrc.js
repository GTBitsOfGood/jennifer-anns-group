module.exports = {
  extends: ["next", "next/core-web-vitals", "plugin:prettier/recommended"],
  rules: {
    // other ESLint rules...
    "prettier/prettier": ["error", { endOfLine: "auto" }],
  },
};

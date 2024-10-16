module.exports = {
  extends: [
    "next",
    "next/core-web-vitals",
    "plugin:prettier/recommended",
    "prettier",
  ],
  rules: {
    "prettier/prettier": ["error", { endOfLine: "auto" }],
  },
};

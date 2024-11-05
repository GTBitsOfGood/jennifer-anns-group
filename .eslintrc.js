module.exports = {
  extends: [
    "next",
    "next/core-web-vitals",
    "plugin:prettier/recommended",
    "prettier",
  ],
  rules: {
    'tailwindcss/classnames-order': 'off',  // Disables sorting rules for class names
    'prettier/prettier': [
      'error',
      {
        tailwindConfig: './tailwind.config.ts',
        htmlWhitespaceSensitivity: 'ignore',
        endOfLine: "auto"
      },
    ],
  },
  plugins: ['tailwindcss']
};

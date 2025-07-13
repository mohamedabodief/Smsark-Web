module.exports = {
  env: {
    es6: true,
    node: true, // ✅ لازم لتفعيل المتغيرات العالمية زي require/module
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "script", // ✅ CommonJS بدل "module"
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "quotes": ["error", "double", { allowTemplateLiterals: true }],
    "no-unused-vars": ["warn"], // ✅ بدل error، عشان تسهّل التطوير
    "no-undef": "off", // ✅ نوقف تحذير require/module مش معرفين
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {
    module: "readonly",
    require: "readonly",
    __dirname: "readonly",
    exports: "readonly",
  },
};

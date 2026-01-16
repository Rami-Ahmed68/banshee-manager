module.exports = {
  extends: ["react-app", "react-app/jest"],
  rules: {
    "no-unused-vars": "warn",
    "react-hooks/exhaustive-deps": "warn"
  },
  ignorePatterns: [
    "build/",
    "node_modules/",
    "dist/"
  ]
};
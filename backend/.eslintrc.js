module.exports = {
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    env: {
        browser: true,
        node: true,
    },
    overrides: [
        {
            files: ["**/*.ts"],
        },
    ],
    ignorePatterns: ["/node_modules", "/dist"]
};

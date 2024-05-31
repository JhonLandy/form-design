import antfu from "@antfu/eslint-config"

export default antfu(
    {
        vue: {
            overrides: {
                "vue/html-indent": ["error", 4, {
                    attribute: 1,
                    baseIndent: 1,
                    closeBracket: 0,
                    alignAttributesVertically: true,
                    ignores: [],
                }],
                "vue/max-attributes-per-line": ["error", {
                    singleline: {
                        max: 5,
                    },
                    multiline: {
                        max: 1,
                    },
                }],
            },
        },
        jsx: true,
        javascript: true,
        typescript: true,
        stylistic: {
            indent: 4,
            quotes: "double",
        },
    },
)

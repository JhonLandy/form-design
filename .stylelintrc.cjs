module.exports = {
    extends: [
        "stylelint-config-standard-scss",
        "stylelint-config-recess-order",
        "stylelint-config-recommended-vue/scss",
    ],
    rules: {
        "alpha-value-notation": "number",
        "selector-class-pattern": [
            "^([a-z][a-z0-9]*)((-|__)[a-z0-9]+)*$",
            {
                message: "按照规范：样式单词拼接时，用'-'表示形容词 ' 或 用'__'表示样式结构层级",
                severity: "warning",
            },
        ],
    },
}

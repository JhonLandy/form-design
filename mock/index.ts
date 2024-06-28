import { parse } from "node:querystring"
import * as prettier from "https://unpkg.com/prettier@3.3.2/standalone.mjs"
import html from "https://unpkg.com/prettier@3.3.2/plugins/html.mjs"
import babel from "https://unpkg.com/prettier@3.3.2/plugins/babel.mjs"
import estree from "https://unpkg.com/prettier@3.3.2/plugins/estree.mjs"
import postcss from "https://unpkg.com/prettier@3.3.2/plugins/postcss.mjs"
// import type { MockMethod } from "vite-plugin-mock"
// import prettier from "prettier/standalone"
// import html from "prettier/plugins/html"
// import babel from "prettier/plugins/babel"
// import estree from "prettier/plugins/estree"
// import postcss from "prettier/plugins/postcss"

// const Mock = require("mockjs")

// const prettierConfig = {
//     tabWidth: 4,
//     singleQuote: false,
//     semi: true,
//     printWidth: 1,
//     jsxSingleQuote: false,
//     quoteProps: "as-needed",
//     arrowParens: "avoid",
//     trailingComma: "none",
//     singleAttributePerLine: false,
//     bracketSpacing: true,
//     bracketSameLine: false,
//     htmlWhitespaceSensitivity: "ignore",
//     jsxBracketSameLine: false,
//     endOfLine: "auto",
// } as ParserOptions
export async function templateFormat(template: any) {
    return await prettier.format(template, {
        tabWidth: 4,
        singleQuote: false,
        singleAttributePerLine: false,
        bracketSameLine: false,
        htmlWhitespaceSensitivity: "ignore",
        parser: "html",
        plugins: [html],
    })
}
export async function scriptFormat(script: any) {
    return await prettier.format(script, {
        tabWidth: 4,
        singleAttributePerLine: true,
        quoteProps: "as-needed",
        arrowParens: "avoid",
        trailingComma: "none",
        endOfLine: "auto",
        parser: "babel",
        plugins: [estree, babel],
    })
}
export async function styleFormat(script: any) {
    return await prettier.format(script, {
        tabWidth: 4,
        singleAttributePerLine: true,
        quoteProps: "as-needed",
        trailingComma: "none",
        endOfLine: "auto",
        parser: "scss",
        plugins: [postcss],
    })
}
export default [
    {
        url: "/vue_format",
        method: "get",
        rawResponse: async (request, res) => {
            const [_, queryString] = request.url!.split("?")
            const query = parse(queryString) || {}
            const template = await templateFormat(query.template)
            const script = await scriptFormat(query.script)
            const style = await styleFormat(query.style)
            res.end(JSON.stringify({ template, script, style }))
        },
    },
] as MockMethod []

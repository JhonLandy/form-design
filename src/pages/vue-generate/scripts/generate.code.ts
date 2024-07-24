import type { VNode } from "vue"
import { isVNode } from "vue"
import type { FormItemRule } from "element-plus"
import { ElForm, ElFormItem } from "element-plus"
import { clone, isNotNil, mergeAll } from "ramda"
import type { DrageComponent, DrageComponentProps, FormItem, FormRow, PropertiesRecord } from "../typings"
import { COMPONENT_DEFAULT_WIDTH } from "../config"
import { filterProps } from "./filter.props"

interface CodeOutput {
    mainBody: string
    template: string
    script: string
    style: string
}
export async function templateFormat(template: any) {
    const [prettier, html] = await Promise.all([
        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-expect-error
        import("https://unpkg.com/prettier@3.3.2/standalone.mjs"),
        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-expect-error
        import("https://unpkg.com/prettier@3.3.2/plugins/html.mjs"),
    ])
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
    const [prettier, estree, babel] = await Promise.all([
        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-expect-error
        import("https://unpkg.com/prettier@3.3.2/standalone.mjs"),
        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-expect-error
        import("https://unpkg.com/prettier@3.3.2/plugins/estree.mjs"),
        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-expect-error
        import("https://unpkg.com/prettier@3.3.2/plugins/babel.mjs"),
    ])
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
    const [prettier, postcss] = await Promise.all([
        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-expect-error
        import("https://unpkg.com/prettier@3.3.2/standalone.mjs"),
        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-expect-error
        import("https://unpkg.com/prettier@3.3.2/plugins/postcss.mjs"),
    ])
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
export async function vueFormat(code: CodeOutput) {
    const template = await templateFormat(code.template)
    const script = await scriptFormat(code.script)
    const style = await styleFormat(code.style)
    return code.mainBody
        .replace(/\[\[template\]\]/, template)
        .replace(/\[\[script\]\]/, script)
        .replace(/\[\[style\]\]/, style)
}
export function formatCompName(tag: string) {
    return tag.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
}
export function getProperty(properties: PropertiesRecord, id: keyof PropertiesRecord, isRender = false) {
    const props = properties[id]
    if (props) {
        const cloneProps = clone(props)
        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-expect-error
        const width = cloneProps.width
        const formProps = properties.formRoot
        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-expect-error
        const compWidth = formProps.compWidth
        if (isNotNil(width) && width === 0) { // 0 就是auto
            // eslint-disable-next-line ts/ban-ts-comment
            // @ts-expect-error
            cloneProps.width = null
            if (!isRender) {
                // eslint-disable-next-line ts/ban-ts-comment
                // @ts-expect-error
                cloneProps.style = { width: `${compWidth}px` }
            }
        }
        else {
            // eslint-disable-next-line ts/ban-ts-comment
            // @ts-expect-error
            cloneProps.style = { width: `${width}px` }
        }
        return cloneProps
    }
    return null
}
function renderProps(property?: DrageComponentProps | null): string {
    if (!property) {
        return ""
    }
    const keys = Object.keys(property)
    return keys.reduce((str, key) => {
        let propsValue = property ? property[key] : null

        if (isNotNil(propsValue)) {
            const valueType = typeof propsValue
            if (["number", "boolean", "object"].includes(valueType)) {
                key = `:${key}`
            }
            propsValue = valueType === "object" ? JSON.stringify(propsValue).replace(/"/g, "'") : propsValue
            return `${str} ${key}="${propsValue}"`
        }
        else {
            return str
        }
    }, "")
}
function renderComponent(element: DrageComponent["element"] | string, props: DrageComponentProps | null, isRoot?: boolean, fieldName?: string): string {
    const vModelStr = fieldName ? `v-model="form.${fieldName}"` : ""
    const classStr = isRoot ? `class="form-comp-style"` : ""
    if (isVNode(element)) {
        const type = element.type

        const tag = typeof type === "string"
            ? type
            // eslint-disable-next-line ts/ban-ts-comment
            // @ts-expect-error
            : type.name
        const children = element.children
        const elementName = formatCompName(tag)
        if (!children) {
            return `<${elementName} ${vModelStr} ${renderProps(props)} ${classStr} />`
        }
        if (typeof children === "string") {
            return `<${elementName} ${renderProps(props)} ${classStr}>${renderComponent(children, null)}</${elementName}>`
        }
        if (Array.isArray(children)) {
            return `
            <${elementName} ${vModelStr} ${renderProps(props)} ${classStr}>
                ${
                    children.map((node) => {
                       return Array.isArray(node)
                            // eslint-disable-next-line ts/ban-ts-comment
                            // @ts-expect-error
                            ? node.map(e => renderComponent(e, e.props)).join("")
                             // eslint-disable-next-line ts/ban-ts-comment
                            // @ts-expect-error
                            : `${renderComponent(node)}`
                    }).join("")
                }
            </${tag}>`
        }
        const slots = children || {}
        const slotNames = Object.keys(slots).filter(key => key !== "_ctx")
        return `
        <${elementName} ${vModelStr} ${renderProps(props)} ${classStr}>
            ${
                slotNames.map((name) => {
                     // eslint-disable-next-line ts/ban-ts-comment
                    // @ts-expect-error
                    const slots = children ? (children[name])() : []
                    const elementStr = Array.isArray(slots)
                        ? slots.map((e: VNode) => renderComponent(e, e.props)).join("")
                        : `${renderComponent(slots, null)}`

                    return name === "default"
                        ? `${elementStr}`
                        : ` <template #${name}>  
                                ${elementStr}
                            </template>`
                }).join("")
            }
        </${elementName}>`
    }
    else if (typeof element === "string") {
        return element
    }
    else {
        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-expect-error
        const elementName = formatCompName(element.name)
        return `<${elementName} ${vModelStr} ${renderProps(props)} ${classStr} />`
    }
}
function renderChildren(component: DrageComponent, properties: PropertiesRecord, extendProperties: PropertiesRecord) {
    const id = component.id
    const element = component.element
    const parent = component.parent
    const parentId = parent.id
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    const defineProps = isVNode(element) ? element.type.props : element.props
    const props = filterProps(defineProps, properties[id])
    const extendProps = getProperty(extendProperties, id, true)
    const parentProps = properties ? properties[parentId] : null
    const normalisedProps = mergeAll([props, extendProps])
    if (parentProps) {
        const fieldName = parentProps.prop
        if (fieldName) {
            return renderComponent(element, normalisedProps, true, fieldName)
        }
    }
    return renderComponent(element, normalisedProps, true)
}
function renderItem(item: FormItem, properties: PropertiesRecord, extendProperties: PropertiesRecord) {
    const props = properties ? filterProps(ElFormItem.props, properties[item.id]) : {}
    const children = item.children
    return `
    <el-form-item ${renderProps(props)}>
        ${renderChildren(children, properties, extendProperties)}
    </el-form-item>`
}

interface StyleOptions {
    maxCompNumber: number
    compWidth: number
}
export function generateCode(rows: FormRow[], properties: PropertiesRecord, extendProperties: PropertiesRecord): CodeOutput {
    const formStyle = extendProperties.formRoot as StyleOptions
    return {
        template: generateTemplate(rows, properties, extendProperties),
        script: generateScript(rows, properties),
        style: generateStyle(formStyle),
        mainBody: `<template>\n[[template]]\n</template>\n<script>\n[[script]]\n</script>\n<style lang="scss" scoped>\n[[style]]\n</style>`,
    }
}
export function generateTemplate(rows: FormRow[], properties: PropertiesRecord, extendProperties: PropertiesRecord) {
    const formProps = filterProps(ElForm.props, properties.formRoot)
    return `
    <el-form class="form-root" :model="form" :rules="rules" ${renderProps(formProps)}>
    ${
        rows.map(({ items }) => `<el-row>${items.map(item => renderItem(item, properties, extendProperties)).join("")}</el-row>`).join("")
    }
    </el-form>
    `
}
interface ScriptResult {
    field?: string
    rules?: Array<FormItemRule>
}
export function generateScript(rows: FormRow[], properties: PropertiesRecord) {
    const validatorSet = new Set<FormItemRule["validator"]>()
    const itemsData = rows.reduce((result: Array<ScriptResult>, row) => {
        const items = row.items
        items.forEach((item) => {
            let itemData: ScriptResult
            const props = properties[item.id]
            const field = props ? props.prop : null
            if (field) {
                const rules = (props ? props.rules : []) as Array<FormItemRule>
                itemData = { field, rules }
                rules.forEach(({ validator }) => validatorSet.add(validator))
                result.push(itemData)
            }
        })
        return result
    }, [])
    const validFuncList = [...validatorSet]
    return `
    export default {

        data() {
            ${
                validFuncList.map((f) => {
                    return f?.toString()
                }).join("\n")
            }
            return {
                form: {
                    ${itemsData.reduce((str, { field }) => {
                        return `${str}${field}:"",`
                    }, "")}
                },
                rules: {
                    ${itemsData.reduce((str, { field, rules }) => {
                        const rulesJson = JSON.stringify(rules, (key, value) => {
                            if (key === "id") {
                                return
                            }
                            if (key === "validator") {
                                return value.name
                            }
                            return value
                        })
                        const rulesStr = rulesJson.replace(/"validator":"(.*?)"/g, "validator: $1")
                        return field ? `${str}${field}:${rulesStr},` : str
                    }, "")}
                }
            }
        }
    }
   `
}
export function generateStyle(options?: StyleOptions) {
    let compWidth = COMPONENT_DEFAULT_WIDTH
    if (options) {
        compWidth = options.compWidth || compWidth
    }
    return `
    .form-root {
        padding: 10px;
    }
    .form-comp-style {
        width: ${compWidth}px;
    }
   `
}

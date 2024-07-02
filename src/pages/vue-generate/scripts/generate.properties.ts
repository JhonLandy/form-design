import type { Prop } from "vue"
import type { PropertiesRecord } from "../typings"

/**
 * @description 提取props的默认值
 * @param { Prop} meta - 组件定义的props对象
 */
export function getDefaultValue(meta: Prop<any>) {
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    const value = meta.default
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    const type = meta.type
    if (value) {
        if (type !== Function && value instanceof Function) {
            return value()
        }
        else {
            return value
        }
    }
    else {
        return undefined
    }
}

/**
 * @description 生成组件定义的props对象值
 */
export function generateProps(definedProps: Prop<unknown>, defaultProps = {}) {
    function setPropValue(props: PropertiesRecord, key: string, meta: Prop<string>, defaultValue?: any) {
        if (![null, undefined].includes(defaultValue)) {
            // 如果有默认值，直接取默认值，不用再做类型判断
            Object.assign(props, { [key]: defaultValue })
            return
        }
        switch (meta) {
            case null:
                Object.assign(props, { [key]: "" })
                break
            case Number:
                Object.assign(props, { [key]: defaultValue })
                break
            case String:
                Object.assign(props, { [key]: defaultValue })
                break
            case Boolean:
                Object.assign(props, { [key]: defaultValue || false })
                break
            case Function: {
                Object.assign(props, { [key]: defaultValue })
                break
            }
            case Array: {
                Object.assign(props, { [key]: defaultValue })
                break
            }
            default:
                // eslint-disable-next-line ts/ban-ts-comment
                // @ts-expect-error
                if (meta.type) {
                    // eslint-disable-next-line ts/ban-ts-comment
                    // @ts-expect-error
                    const type = meta.type as any

                    if (Array.isArray(type)) {
                        if (type.includes(String)) {
                            setPropValue(props, key, String, getDefaultValue(meta))
                        }
                        else {
                            setPropValue(props, key, type[0], getDefaultValue(meta))
                        }
                    }
                    else {
                        setPropValue(props, key, type, getDefaultValue(meta))
                    }
                }
                else {
                    Object.assign(props, { [key]: getDefaultValue(meta) })
                }
        }
    }
    return Object.keys(definedProps).reduce((props, key) => {
        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-expect-error
        setPropValue(props, key, definedProps[key], defaultProps[key])
        return props
    }, {})
}

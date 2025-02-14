import { equals, isNil, isNotEmpty } from "ramda"
import type { DrageComponentProps } from "../typings"
import { getDefaultValue } from "./generate.properties"

/**
 * @description 提取用于生成代码的props值(不渲染没有传递、只有默认值的props)
 */
export function filterProps(defineProps: any, props: DrageComponentProps) {
    if (isNil(defineProps) || isNil(props)) {
        return null
    }
    const keys = Object.keys(defineProps)
    return keys.reduce((result, key) => {
        if (["width", "rules"].includes(key)) {
            return result
        }
        const defineProp = defineProps[key]
        const propValue = props[key]
        if (Object.prototype.toString.call(defineProp) === "[object Object]") {
            const defautlValue = getDefaultValue(defineProp)
            if (propValue && isNotEmpty(propValue) && !equals(propValue, defautlValue)) {
                return { ...result, [key]: propValue }
            }
        }
        else {
            if (propValue) {
                return { ...result, [key]: propValue }
            }
        }
        return result
    }, {})
}

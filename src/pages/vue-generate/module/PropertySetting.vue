<script  lang="tsx">
import { Fragment, h, inject, markRaw, ref, watchEffect } from "vue"
import { ElInput, ElOption, ElSelect, ElSlider, ElSwitch, ElTooltip } from "element-plus"
import { BUTTON_TYPES_OPTIONS, DATE_PICKER_TYPES_OPTIONS, DATE_TIME_PICKER_TYPES_OPTIONS, POSITION_OPTIONS, SIZE_OPTIONS } from "../config"
import type { DrageComponent } from "../typings"
import ProcessComponent from "./ProcessComponent.vue"

type SettingItem = [string, DrageComponent["element"], object]
type Settings = Array<SettingItem>
export default {
    props: ["modelValue", "extends"],
    emits: ["update:modelValue", "update:extends"],
    setup(props, { emit }) {
        const getCurrentCompType = inject<() => string>("getCurrentCompType")

        const commonInput = ref<Settings>([])
        const numberInput = ref<Settings>([])
        const booleanInput = ref<Settings>([])
        const ojectInput = ref<Settings>([])
        function renderLabel(label: string) {
            const len = label.length
            const maxlen = 18
            return len > maxlen ? <ElTooltip content={label}>{[label.substring(0, maxlen - 3), "..."].join("")}</ElTooltip> : label
        }
        watchEffect(() => {
            // eslint-disable-next-line ts/ban-ts-comment
            // @ts-expect-error
            const compType = getCurrentCompType()
            commonInput.value = []
            numberInput.value = []
            booleanInput.value = []
            ojectInput.value = []
            const properties = props.modelValue || {}
            const keys = Object.keys(properties)
            keys.forEach((key) => {
                const value = properties[key]
                const valueType = Object.prototype.toString.call(value)
                if (["width"].includes(key)) {
                    numberInput.value.push([key, markRaw(ElSlider), { marks: { 0: "auto", 1000: { label: "1000", style: { left: "99%" } } }, style: { height: "50px" }, size: "small", min: 0, max: 1000 }])
                    return
                }
                if (["labelWidth", "compWidth"].includes(key)) {
                    numberInput.value.push([key, markRaw(ElSlider), { marks: { 0: "0", 1000: { label: "1000" } }, style: { height: "50px" }, size: "small", min: 0, max: 1000 }])
                    return
                }
                if (["size"].includes(key)) {
                    commonInput.value.push([
                        key,
                        markRaw(h(ElSelect, {}, {
                            default: () => SIZE_OPTIONS.map(value => h(ElOption, { value, label: value })),
                        })),
                        { size: "small", placeholder: "选择" },
                    ])
                    return
                }
                if (compType === "ElButton" && ["type"].includes(key)) {
                    commonInput.value.push([
                        key,
                        markRaw(h(ElSelect, {}, {
                            default: () => BUTTON_TYPES_OPTIONS.map(value => h(ElOption, { value, label: value })),
                        })),
                        { size: "small", placeholder: "选择" },
                    ])
                    return
                }
                if (compType === "ElDatePicker" && ["type"].includes(key)) {
                    commonInput.value.push([
                        key,
                        markRaw(h(ElSelect, {}, {
                            default: () => DATE_PICKER_TYPES_OPTIONS.map(value => h(ElOption, { value, label: value })),
                        })),
                        { size: "small", placeholder: "选择" },
                    ])
                    return
                }
                if (compType === "ElDatetimePicker" && ["type"].includes(key)) {
                    commonInput.value.push([
                        key,
                        markRaw(h(ElSelect, {}, {
                            default: () => DATE_TIME_PICKER_TYPES_OPTIONS.map(value => h(ElOption, { value, label: value })),
                        })),
                        { size: "small", placeholder: "选择" },
                    ])
                    return
                }
                if (["labelPosition", "requireAsteriskPosition", "placement"].includes(key)) {
                    commonInput.value.push([
                        key,
                        markRaw(h(ElSelect, {}, {
                            default: () => POSITION_OPTIONS.map(value => h(ElOption, { value, label: value })),
                        })),
                        { size: "small", placeholder: "选择" },
                    ])
                    return
                }
                switch (valueType) {
                    case "[object Number]":
                        numberInput.value.push([key, markRaw(ElSlider), { size: "small", min: 0 }])
                        break
                    case "[object String]":
                        commonInput.value.push([key, markRaw(ElInput), { size: "small", placeholder: "未设置默认值" }])
                        break
                    case "[object Boolean]":
                        booleanInput.value.push([key, markRaw(ElSwitch), { size: "small" }])
                        break
                    case "[object Array]":
                    case "[object Object]":
                        ojectInput.value.push([key, markRaw(ElInput), { type: "textarea", placeholder: "未设置默认值", rows: Object.keys(value).length + 2 }])
                        break
                    default:
                        commonInput.value.push([key, markRaw(ElInput), { size: "small", placeholder: "未设置默认值" }])
                }
            })
        })
        function onUpdateModelValue(key: any, val: string) {
            let value = ""
            try {
                val = /\{[\s\S]+\}/.test(val) ? JSON.parse(val) : val
            }
            catch {
                value = val
            }
            emit("update:modelValue", { ...props.modelValue, [key]: value })
        }
        const modelValue = function (key: string) {
            let modelValue = props.modelValue[key]

            try {
                if (typeof modelValue === "object") {
                    modelValue = JSON.stringify({ ...modelValue }, null, 2)
                }
            }
            catch {}

            return modelValue
        }
        return () => (
            <Fragment>
                <section class="setting">
                    {
                        numberInput.value.map(([key, Input, inputProps]) => (
                            <section class="setting__item number-input-style" key={key}>
                                <p class="setting__item__label">
                                    {renderLabel(key)}
                                </p>
                                {/* eslint-disable-next-line ts/ban-ts-comment */}
                                {/* @ts-expect-error */}
                                <ProcessComponent element={Input} modelValue={modelValue(key)} onUpdate:modelValue={(val: any) => onUpdateModelValue(key, val)} props={inputProps} />
                            </section>
                        ))
                    }
                </section>
                <section class="setting">
                    {
                        booleanInput.value.map(([key, Input, inputProps]) => (
                            <section class="setting__item" key={key}>
                                <p class="setting__item__label">
                                    {renderLabel(key)}
                                </p>
                                {/* eslint-disable-next-line ts/ban-ts-comment */}
                                {/* @ts-expect-error */}
                                <Input modelValue={modelValue(key)} onUpdate:modelValue={(val: any) => onUpdateModelValue(key, val)} {...inputProps} />
                            </section>
                        ))
                    }
                </section>
                <section class="setting">
                    {
                        commonInput.value.map(([key, Input, inputProps]) => (
                            <section class="setting__item" key={key}>
                                <p class="setting__item__label">
                                    {renderLabel(key)}
                                </p>
                                {/* eslint-disable-next-line ts/ban-ts-comment */}
                                {/* @ts-expect-error */}
                                <Input modelValue={modelValue(key)} onUpdate:modelValue={(val: any) => onUpdateModelValue(key, val)} {...inputProps} />
                            </section>
                        ))
                    }
                </section>
                <section class="setting">
                    {
                        ojectInput.value.map(([key, Input, inputProps]) => (
                            <section class="setting__item object-input-style" key={key}>
                                <p class="setting__item__label">
                                    {key}
                                </p>
                                {/* eslint-disable-next-line ts/ban-ts-comment */}
                                {/* @ts-expect-error */}
                                <Input modelValue={modelValue(key)} onUpdate:modelValue={(val: any) => onUpdateModelValue(key, val)} {...inputProps} />
                            </section>
                        ))
                    }
                </section>
            </Fragment>
        )
    },
}
</script>

<style lang="scss" scoped>
.setting {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    user-select: none;
}

.setting__item {
    width: 48%;
    padding: 5px 18px;
    font-size: $font-size-small;
    color: $color-black;
    border-radius: 5px;
    transition: .8s;

    &:hover {
        background: aliceblue;
    }

    &__label {
        padding: 5px 0;
        color: $label-color;
    }

    &:hover &__label{
        color: $color-primary;
    }
}

.number-input-style {
    flex-basis: 100%;
}

.object-input-style {
    flex-basis: 100%;
}
</style>

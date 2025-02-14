<script  lang="tsx">
import { Fragment, h, inject, markRaw, ref, watchEffect } from "vue"
import { ElInput, ElMessage, ElOption, ElSelect, ElSlider, ElSwitch, ElTooltip } from "element-plus"
import { useI18n } from "vue-i18n"
import { BUTTON_TYPES_OPTIONS, DATE_PICKER_TYPES_OPTIONS, DATE_TIME_PICKER_TYPES_OPTIONS, EFFECT_OPTIONS, POSITION_OPTIONS, SIZE_OPTIONS, VALIDATOR_OPTIONS } from "../config"
import type { DrageComponent } from "../typings"
import ProcessComponent from "./ProcessComponent.vue"

type SettingItem = [string, DrageComponent["element"], object]
type Settings = Array<SettingItem>
export default {
    props: ["modelValue", "extends"],
    emits: ["update:modelValue", "update:extends"],
    setup(props, { emit }) {
        const { t } = useI18n()
        const getCurrentCompType = inject<() => string>("getCurrentCompType")

        const commonInput = ref<Settings>([])
        const numberInput = ref<Settings>([])
        const booleanInput = ref<Settings>([])
        const ojectInput = ref<Settings>([])
        function renderLabel(label: string) {
            label = t(label)
            const len = label.length
            const maxlen = 18
            return len > maxlen ? <ElTooltip content={label}>{[label.substring(0, maxlen - 3), "..."].join("")}</ElTooltip> : label
        }

        function onUpdateModelValue(key: any, val: string, type?: "object") {
            if (key === "validator") {
                emit("update:modelValue", { ...props.modelValue, [key]: val })
                return
            }
            try {
                if (type === "object") {
                    // 处理回车
                    val = val.replace(/\n\n\}/, `,"key":"value"}`)
                    val = JSON.parse(val)
                }
                emit("update:modelValue", { ...props.modelValue, [key]: val })
            }
            catch {
                try {
                    // 处理最后一个属性是逗号
                    val = val.replace(/\s/g, "").replace(/[,|\s]\}/, `,"key":"value"}`)
                    val = JSON.parse(val)
                    emit("update:modelValue", { ...props.modelValue, [key]: val })
                }
                catch {
                    ElMessage.error(`属性${t(key)}配置失败： json格式异常,建议通过复制粘贴方式赋值`)
                }
            }
        }
        const modelValue = function (key: string) {
            let modelValue = props.modelValue[key]
            const typeStr = Object.prototype.toString.call(modelValue)
            try {
                if (typeStr === "[object Object]") {
                    modelValue = JSON.stringify({ ...modelValue }, null, 2)
                }
            }
            catch {}

            return modelValue
        }
        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-expect-error
        const compType = getCurrentCompType()
        watchEffect(() => {
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
                    numberInput.value.push([
                        key,
                        markRaw(h(ElSelect, {}, {
                            default: () => SIZE_OPTIONS.map(value => h(ElOption, { value, label: value })),
                        })),
                        { size: "small", placeholder: "选择" },
                    ])
                    return
                }
                if (compType === "ElButton" && ["type"].includes(key)) {
                    numberInput.value.push([
                        key,
                        markRaw(h(ElSelect, {}, {
                            default: () => BUTTON_TYPES_OPTIONS.map(value => h(ElOption, { value, label: value })),
                        })),
                        { size: "small", placeholder: "选择" },
                    ])
                    return
                }
                if (compType === "ElDatePicker" && ["type"].includes(key)) {
                    numberInput.value.push([
                        key,
                        markRaw(h(ElSelect, {}, {
                            default: () => DATE_PICKER_TYPES_OPTIONS.map(value => h(ElOption, { value, label: value })),
                        })),
                        { size: "small", placeholder: "选择" },
                    ])
                    return
                }
                if (compType === "ElDatetimePicker" && ["type"].includes(key)) {
                    numberInput.value.push([
                        key,
                        markRaw(h(ElSelect, {}, {
                            default: () => DATE_TIME_PICKER_TYPES_OPTIONS.map(value => h(ElOption, { value, label: value })),
                        })),
                        { size: "small", placeholder: "选择" },
                    ])
                    return
                }
                if (["labelPosition", "requireAsteriskPosition", "placement"].includes(key)) {
                    numberInput.value.push([
                        key,
                        markRaw(h(ElSelect, {}, {
                            default: () => POSITION_OPTIONS.map(value => h(ElOption, { value, label: value })),
                        })),
                        { size: "small", placeholder: "选择" },
                    ])
                    return
                }
                if (key === "effect") {
                    numberInput.value.push([
                        key,
                        markRaw(h(ElSelect, {}, {
                            default: () => EFFECT_OPTIONS.map(({ label, key }) => h(ElOption, { value: key, label })),
                        })),
                        { size: "small", placeholder: "选择主题" },
                    ])
                }
                if (key === "rules") {
                    numberInput.value.push([
                        key,
                        markRaw(h(ElSelect, { valueKey: "id" }, {
                            default: () => VALIDATOR_OPTIONS.map(({ label, key }) => h(ElOption, { value: key, label })),
                        })),
                        { size: "small", multiple: true, placeholder: "选择校验方式" },
                    ])
                    return
                }
                switch (valueType) {
                    case "[object Number]":
                        numberInput.value.push([key, markRaw(ElSlider), { size: "small", min: 0, max: 1000, marks: { 0: "0", 1000: { label: "1000" } } }])
                        break
                    case "[object String]":
                        commonInput.value.push([key, markRaw(ElInput), { size: "small", placeholder: key }])
                        break
                    case "[object Boolean]":
                        booleanInput.value.push([key, markRaw(ElSwitch), { size: "small" }])
                        break
                    case "[object Array]":
                    case "[object Object]":
                        ojectInput.value.push([key, markRaw(ElInput), { type: "textarea", placeholder: key, rows: Object.keys(value).length + 2 }])
                        break
                    default:
                        commonInput.value.push([key, markRaw(ElInput), { size: "small", placeholder: key }])
                }
            })
        })

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
                                <Input modelValue={modelValue(key)} onUpdate:modelValue={(val: any) => onUpdateModelValue(key, val, "object")} {...inputProps} />
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
    padding: 18px;
    padding-bottom: 10px;
    font-size: $font-size-small;
    color: $color-black;
    border-radius: 5px;
    transition: .8s;

    &:hover {
        background: aliceblue;
    }

    &__label {
        width: 100%;
        color: $label-color;

        @include text-ellipsis(1)
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

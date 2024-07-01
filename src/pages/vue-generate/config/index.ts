import { ElAutocomplete, ElAvatar, ElButton, ElCascader, ElCheckbox, ElCheckboxButton, ElCheckboxGroup, ElDatePicker, ElDivider, ElDropdown, ElDropdownItem, ElDropdownMenu, ElInput, ElInputNumber, ElOption, ElRadio, ElRadioButton, ElRadioGroup, ElRate, ElSelect, ElSelectV2, ElSlider, ElSwitch, ElTimePicker, ElTimeSelect, ElTreeSelect, ElUpload } from "element-plus"
import { clone } from "ramda"
import { h } from "vue"

const SHOW_DATA = ["item1", "item2"]
const RADIO_DATA = ["单选1", "单选2"]
const CHECKBOX_DATA = ["多选1", "多选2"]
/**
 * @description 组件长度
 */
export const COMPONENT_DEFAULT_WIDTH: number = 200
export const MAX_COMPONENT_NUMBER = 2
export const SIZE_OPTIONS = ["default", "small", "large"]
export const POSITION_OPTIONS = ["top", "left", "bottom", "right"]
export const BUTTON_TYPES_OPTIONS = ["primary", "success", "warning", "danger"]
export const DATE_PICKER_TYPES_OPTIONS = ["year", "month", "date", "dates", "months", "years", "week", "datetimerange", "daterange", "monthrange"]
export const DATE_TIME_PICKER_TYPES_OPTIONS = ["year", "month", "date", "week", "datetime", "datetimerange", "daterange"]
export const TREE_SELECT_OPTIONS = [{
    value: "1",
    label: "一级",
    children: [
        {
            value: "1-1",
            label: "二级",
            children: [
                {
                    value: "1-1-1",
                    label: "三级",
                },
            ],
        },
    ],
}]
export const CASCADER_DATA = [{
    value: "item1",
    label: "item1",
    children: [
        {
            value: "item2",
            label: "item2",
        },
    ],
}]
export const TRANSER_DATA = [{
    key: 1,
    label: `Option 1`,
    disabled: false,
}, {
    key: 2,
    label: `Option 2`,
    disabled: true,
}]
export const SELECT_V2_OPTIONS = [{
    key: 1,
    label: `Option 1`,
}, {
    key: 2,
    label: `Option 2`,
}]
const ElDateTimePicker = clone(ElDatePicker)
ElDateTimePicker.name = "ElDatetimePicker"
/**
 * @description vue组件集合
 */
export const COMPONENT_COLLECTION = [
    h(ElInput, { placeholder: "输入框" }),
    h(ElAutocomplete, { placeholder: "自动补全输入信息" }),
    h(ElSelect, { placeholder: "下拉框" }, {
        default: () => SHOW_DATA.map(value => h(ElOption, { value, label: value })),
    }),
    h(ElSelectV2, { modelValue: "", placeholder: "虚拟化数据下拉框", options: SELECT_V2_OPTIONS }),
    h(ElCascader, { placeholder: "级联选择下拉框", options: CASCADER_DATA }),
    h(ElTreeSelect, { placeholder: "树形选择下拉框", data: TREE_SELECT_OPTIONS }),
    h(ElInputNumber, { placeholder: "计数器" }),
    h(ElButton, { type: "primary" }, {
        default: () => "默认按钮",
    }),
    h(ElDatePicker, { type: "date", placeholder: "日期选择器" }),
    h(ElDateTimePicker, { type: "datetime", placeholder: "日期时间选择器" }),
    h(ElTimePicker, { placeholder: "时间选择器" }),
    h(ElTimeSelect, { placeholder: "时间下拉框" }),
    h(ElDropdown, { splitButton: true }, {
        default: () => h("span", "下拉菜单"),
        dropdown: () => h(ElDropdownMenu, null, { default: () => SHOW_DATA.map(value => h(ElDropdownItem, () => value)) }),
    }),
    h(ElRadioGroup, { modelValue: "单选1" }, {
        default: () => RADIO_DATA.map(value => h(ElRadio, { value, label: value })),
    }),
    h(ElRadioGroup, { modelValue: "单选1" }, {
        default: () => RADIO_DATA.map(value => h(ElRadioButton, { value, label: value })),
    }),
    h(ElCheckboxGroup, { modelValue: ["多选1"] }, {
        default: () => CHECKBOX_DATA.map(value => h(ElCheckbox, { value, label: value })),
    }),
    h(ElCheckboxGroup, { modelValue: ["多选1"] }, {
        default: () => CHECKBOX_DATA.map(value => h(ElCheckboxButton, { value, label: value })),
    }),
    h(ElUpload, {
        fileList: [],
        action: "https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15",
        multiple: true,
    }, {
        default: () => h(ElButton, { type: "primary" }, {
            default: () => "上传文件",
        }),
        tip: () => h("div", { class: "el-upload__tip" }, "这是一段tip"),
    }),
    h(ElAvatar, { }, { default: () => "头像" }),
    h(ElDivider, {}, { default: () => "分线" }),
    ElSwitch,
    ElSlider,
    ElRate,
]

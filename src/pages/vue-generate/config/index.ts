import { ElAvatar, ElButton, ElCascader, ElCheckbox, ElCheckboxGroup, ElDatePicker, ElDivider, ElDropdown, ElDropdownItem, ElDropdownMenu, ElInput, ElInputNumber, ElOption, ElRadio, ElRadioGroup, ElRate, ElSelect, ElSlider, ElSwitch, ElTimePicker, ElTimeSelect, ElTransfer, ElTreeSelect, ElUpload } from "element-plus"
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
export const DATE_PICKER_TYPES_OPTIONS = ["year", "month", "date", "dates", "months", "years", "week", "datetime", "datetimerange", "daterange", "monthrange"]
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
/**
 * @description vue组件集合
 */
export const COMPONENT_COLLECTION = [
    h(ElInput, { placeholder: "输入框" }),
    h(ElSelect, { placeholder: "下拉框" }, {
        default: () => SHOW_DATA.map(value => h(ElOption, { value, label: value })),
    }),
    h(ElCascader, { placeholder: "级联选择下拉框", options: CASCADER_DATA }),
    h(ElTreeSelect, { placeholder: "树形选择下拉框", data: TREE_SELECT_OPTIONS }),
    h(ElInputNumber, { placeholder: "计数器" }),
    h(ElButton, { type: "primary" }, {
        default: () => "默认按钮",
    }),
    h(ElDatePicker, { placeholder: "日期选择器" }),
    h(ElTimePicker, { placeholder: "时间选择器" }),
    h(ElTimeSelect, { placeholder: "时间下拉框" }),
    h(ElDropdown, { splitButton: true }, {
        default: () => h("span", "下拉菜单"),
        dropdown: () => h(ElDropdownMenu, null, { default: () => SHOW_DATA.map(value => h(ElDropdownItem, () => value)) }),
    }),
    ElSwitch,
    ElSlider,
    h(ElRadioGroup, null, {
        default: () => RADIO_DATA.map(value => h(ElRadio, { value, label: value })),
    }),
    h(ElCheckboxGroup, null, {
        default: () => CHECKBOX_DATA.map(value => h(ElCheckbox, { value, label: value })),
    }),
    ElRate,
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
]

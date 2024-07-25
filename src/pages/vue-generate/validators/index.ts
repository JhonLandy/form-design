function moneyValidator(_: any, value: any, callback: any) {
    if (/^(?:[1-9]\d*|0)\.\d$|^[1-9]\d*$|^0$/.test(value)) {
        callback()
    }
    else {
        callback("请输入正确的货币格式")
    }
}
moneyValidator.name = "moneyValidator"
moneyValidator.content = `
function moneyValidator(_: any, value: any, callback: any) {
    if (/^(?:[1-9]\d*|0)\.\d$|^[1-9]\d*$|^0$/.test(value)) {
        callback()
    }
    else {
        callback("请输入正确的货币格式")
    }
}
`
function percentValidator(_: any, value: any, callback: any) {
    if (/^(?:[1-9]\d*|0)\.\d{1,2}$|^[1-9]\d*$|^0$/.test(value)) {
        callback()
    }
    else {
        callback("请输入正确的百分比格式")
    }
}
percentValidator.name = "percentValidator"
percentValidator.content = `
    function percentValidator(_: any, value: any, callback: any) {
        if (/^(?:[1-9]\d*|0)\.\d{1,2}$|^[1-9]\d*$|^0$/.test(value)) {
            callback()
        }
        else {
            callback("请输入正确的百分比格式")
        }
    }
`
export { percentValidator, moneyValidator }
export const MONEY_RULE = { id: "money", validator: moneyValidator }

export const PERCENT_RULE = { id: "percent", validator: percentValidator }

export const REQUIRED_RULE = { id: "required", required: true, message: "必填" }

export const EMAIL_RULE = { id: "email", type: "email", message: "请输入正确的邮箱地址" }

export const NUMBER_RULE = { id: "number", type: "number", message: "请填写数字" }

export const DATE_RULE = { id: "date", type: "date", message: "请填写正确的日期" }

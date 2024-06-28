import type { Plugin, VNode } from "vue"

export type DrageComponentProps = VNode["props"]

export interface FormRow {
    id: symbol
    items: FormItem []
}
export interface FormItem {
    id: symbol
    props?: DrageComponentProps
    children: DrageComponent
    parent: FormRow
}
export interface DrageComponent {
    id: symbol
    props?: DrageComponentProps
    element: Plugin | VNode
    parent: FormItem
}

export interface PropertiesRecord {
    formRoot: object
    [key: symbol]: DrageComponentProps
}

<script lang="tsx">
import { ElForm, ElFormItem, ElRow } from "element-plus"
import type { FormRow, PropertiesRecord } from "../typings"
import { getProperty } from "../scripts"
import ProcessComponent from "./ProcessComponent.vue"

export default {
    props: ["formData", "properties", "extendProperties"],
    emits: ["update:modelValue", "update:extends"],
    setup(props) {
        function getProps(id: keyof PropertiesRecord) {
            return props.properties[id]
        }
        // const compWidth = computed<number>(() => {
        //     const extendProps = props.extendProperties.formRoot
        //     return extendProps.compWidth
        // })
        function getExtendProps(id: keyof PropertiesRecord) {
            return getProperty(props.extendProperties, id)
        }
        return () => {
            const formData = props.formData as Array<FormRow>
            return (
                <ElForm class="form-preview" {...getProps("formRoot")}>
                    {
                        formData.map((row) => {
                            return (
                                <ElRow>
                                    { row.items.map(item => (
                                        <ElFormItem key={item.id} {...getProps(item.id)}>
                                            <ProcessComponent style="width:100%" {...getExtendProps(item.children.id)} props={getProps(item.children.id)} element={item.children.element} />
                                        </ElFormItem>
                                    ))}
                                </ElRow>
                            )
                        })
                    }
                </ElForm>
            )
        }
    },
}
</script>

<style lang="scss" scoped>
.form-preview {
    padding: 10px;
    border: 1px solid $color-gray;

}
</style>

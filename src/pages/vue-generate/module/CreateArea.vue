<script lang="tsx">
import { ElForm, ElFormItem, ElRow } from "element-plus"
import { v4 } from "uuid"
import { type DefineComponent, type Ref, markRaw, onUpdated, reactive, ref, shallowReactive, shallowRef } from "vue"
import { VueDraggable } from "vue-draggable-plus"
// import NestedComponent from "./NestedComponent"
interface Row {
    id: string
    oldIndex: number
    components: DrageComponent []
}
interface DrageComponent {
    id: string
    element: DefineComponent
}
export default {
    setup() {
        const dragComponents = shallowRef<DrageComponent []>([])
        const rows = reactive<Row []>([])
        // const rowsComp = shallowReactive<Array<DrageComponent []>>([])
        function onAdd() {
            const comps = dragComponents.value
            const len = comps.length
            const newComp = comps[len - 1]

            rows.push({
                id: v4(),
                oldIndex: len - 1,
                components: shallowReactive([newComp]),
            })
        }
        function dataTransfer(element: DrageComponent) {
            return element
        }

        const onRowRemove = (row: Row, index: number) => {
            if (row.components.length === 0) {
                row.oldIndex = index
                rows.splice(row.oldIndex, 1)
                dragComponents.value.splice(row.oldIndex, 1)
            }
        }
        return () => (
            <ElForm class="put-area form-drag-area">
                <VueDraggable
                    class="create-area"
                    // eslint-disable-next-line ts/ban-ts-comment
                    // @ts-expect-error
                    vModel={dragComponents.value}
                    group="component"
                    onAdd={onAdd}
                >
                    {rows.map((row, index) => (
                        <ElRow key={row.id}>
                            <VueDraggable
                                // eslint-disable-next-line ts/ban-ts-comment
                                // @ts-expect-error
                                vModel={row.components}
                                class="row-drag-area"
                                group="component"
                                clone={dataTransfer}
                                onRemove={() => onRowRemove(row, index)}
                            >
                                {
                                    row.components.map(Comp => (
                                        <ElFormItem class="collection__item" key={Comp.id}>
                                            <Comp.element />
                                        </ElFormItem>
                                    ))
                                }
                            </VueDraggable>
                        </ElRow>
                    ))}
                </VueDraggable>
            </ElForm>
        )
    },

}
</script>

<style lang="scss" scoped>
::v-deep(.el-form) {
    height: 100%;
}

.create-area,  .put-area {
    height: 100%;
}

.form-drag-area {
    width: 100%;
    min-height: 50px;

    // outline: 1px dashed
}

.row-drag-area {
    width: 100%;
    min-height: 50px;
    margin: 2px;
    outline: 1px dashed
}
</style>

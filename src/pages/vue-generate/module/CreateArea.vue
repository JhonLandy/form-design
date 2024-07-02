<script lang="tsx">
import { ClickOutside, ElButton, ElForm, ElFormItem, ElIcon, ElMessageBox, ElRow } from "element-plus"
import { Delete, Edit, Sort } from "@element-plus/icons-vue"
import { TransitionGroup, computed, ref } from "vue"
import { type SortableEvent, VueDraggable } from "vue-draggable-plus"
import type { DrageComponent, FormItem, FormRow, PropertiesRecord } from "../typings"
import { getProperty } from "../scripts"
import ProcessComponent from "./ProcessComponent.vue"

export default {
    directives: { ClickOutside },
    props: ["properties", "extendProperties", "modelValue"],
    emits: ["rowClicked", "formItemClicked", "compClicked", "compCreated", "compRemoved", "update:modelValue"],
    setup(props, { emit, expose }) {
        const rows = ref<FormRow []>([])
        const properties = computed<PropertiesRecord>(() => props.properties || {})

        // const compWidth = computed<number>(() => {
        //     const extendProps = props.extendProperties.formRoot
        //     return extendProps.compWidth
        // })
        /**
         * Description 表单被添加进组件时触发
         * @returns {void}
         */
        function onFormAdd(event: SortableEvent) {
            const newIndex = event.newIndex
            if (newIndex !== undefined) {
                const row = rows.value[newIndex]
                row.items.forEach((item) => {
                    emit("compCreated", item)
                })
            }
        }

        /**
         * Description 表单行被删除时触发
         * @returns {void}
         */
        // function onFormRemove(event: SortableEvent) {
        //     const oldIndex = event.oldIndex
        //     if (oldIndex !== undefined) {
        //         emit("compRemoved")
        //     }
        // }
        /**
         * Description 表单 单行被添加进组件时触发
         * @param {any} row
         * @param {any} _
         * @returns {void}
         */
        function onFormItemAdd(row: FormRow, _: number) {
            const items = row.items
            const len = items.length
            const item = items[len - 1]
            item.parent = row
            emit("compCreated", item)
        }

        function dataTransfer(element: DrageComponent) {
            return element
        }
        /**
         * Description 移除当前行
         * @param {any} row
         * @returns {void}
         */
        const removeRow = (row: FormRow) => {
            const rowIndex = rows.value.findIndex(r => r === row)
            if (rowIndex > -1) {
                row.items.forEach(item => emit("compRemoved", item))
                rows.value.splice(rowIndex, 1)
            }
        }
        /**
         * Description 移除当前组件
         * @param {any} comp
         * @returns {void}
         */
        const removeComp = (comp: DrageComponent) => {
            const item = comp.parent
            const row = item.parent
            const itemIndex = row.items.findIndex(t => t.id === item.id)
            if (itemIndex > -1) {
                row.items.splice(itemIndex, 1)
                emit("compRemoved", item)
            }
        }
        /**
         * Description 当前行删除按钮被点击时触发
         * @param {any} row
         * @returns {void}
         */
        async function onRowDelBtnClicked(row: FormRow) {
            await ElMessageBox.confirm(
                "删除全部组件?",
                "Tips",
                {
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancel",
                    type: "warning",
                },
            )
            removeRow(row)
        }
        /**
         * Description 当前行组件被拖拽移除时触发
         * @param {any} row
         * @returns {void}
         */
        const onDrageRemove = (row: FormRow) => {
            if (row.items.length === 0) {
                removeRow(row)
            }
        }
        /**
         * Description 当前组件被移除时触发
         * @param {any} item
         * @returns {void}
         */
        const onItemRemove = async (item: FormItem) => {
            await ElMessageBox.confirm(
                "删除组件?",
                "Tips",
                {
                    confirmButtonText: "OK",
                    cancelButtonText: "Cancel",
                    type: "warning",
                },
            )
            removeComp(item.children)

            const row = item.parent
            if (row.items.length === 0) {
                removeRow(row)
            }
        }
        /**
         * Description 组件被点击时触发
         * @param {any} item
         * @returns {void}
         */
        const onItemClicked = (item: FormItem) => {
            emit("compClicked", item)
        }

        function getProps(id: keyof PropertiesRecord) {
            return properties.value[id]
        }
        function getExtendProps(id: keyof PropertiesRecord) {
            return getProperty(props.extendProperties, id)
        }
        expose({ rows })
        return () => (
            <ElForm class="put-area form-drag-area" {...getProps("formRoot")}>
                {/* eslint-disable-next-line ts/ban-ts-comment */}
                {/* @ts-expect-error */}
                <VueDraggable
                    class="create-area"
                    v-model={rows.value}
                    group="form"
                    onAdd={onFormAdd}
                    handle=".form-row__sort-btn"
                >
                    {rows.value.map((row, rowIndex) => (
                        <ElRow key={row.id}>
                            {/* eslint-disable-next-line ts/ban-ts-comment */}
                            {/* @ts-expect-error */}
                            <VueDraggable
                                v-model={row.items}
                                class="form-row-drag-area"
                                group="form-row"
                                clone={dataTransfer}
                                onAdd={() => onFormItemAdd(row, rowIndex)}
                                onRemove={() => onDrageRemove(row)}
                                target=".transition-fade"
                                handle=".comp-wrapper__sort-btn"
                            >
                                <TransitionGroup
                                    type="transition"
                                    tag="sction"
                                    name="fade"
                                    /* eslint-disable-next-line ts/ban-ts-comment */
                                    /* @ts-expect-error */
                                    class="transition-fade"
                                >
                                    {
                                        row.items?.map(item => (
                                            <ElFormItem class="form-item" key={item.id} {...getProps(item.id)}>
                                                <section class="comp-wrapper">
                                                    <section class="comp-wrapper__sort-btn">
                                                        <ElIcon color="gray"><Sort /></ElIcon>
                                                    </section>
                                                    <section class="comp-wrapper__input">
                                                        <ProcessComponent {...getExtendProps(item.children.id)} props={getProps(item.children.id)} element={item.children.element} />
                                                    </section>
                                                    <section class="comp-wrapper__action">
                                                        {/* eslint-disable-next-line ts/ban-ts-comment */}
                                                        {/* @ts-expect-error */}
                                                        <ElIcon class="edit-btn" onClick={() => onItemClicked(item)} color="gray">
                                                            <Edit />
                                                        </ElIcon>
                                                        {/* eslint-disable-next-line ts/ban-ts-comment */}
                                                        {/* @ts-expect-error */}
                                                        <ElIcon class="del-btn" onClick={() => onItemRemove(item)} color="gray">
                                                            <Delete />
                                                        </ElIcon>
                                                    </section>
                                                </section>
                                            </ElFormItem>
                                        ))
                                    }
                                </TransitionGroup>
                            </VueDraggable>
                            <section class="form-row__action">
                                <ElButton class="form-row__sort-btn" type="primary" link onClick={() => onRowDelBtnClicked(row)} size="small">
                                    <ElIcon>
                                        <Sort />
                                    </ElIcon>
                                </ElButton>
                                <ElButton type="danger" link onClick={() => onRowDelBtnClicked(row)} size="small">
                                    <ElIcon>
                                        <Delete />
                                    </ElIcon>
                                </ElButton>
                            </section>
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

.form-row {
    position: relative;

    &__action {
        position: absolute;
        right: 0;
        bottom: 1px;
        text-align: right;
        cursor: pointer;
        background: aliceblue;
        border-radius: 5px 0 0;
    }

    &__sort-btn {
        cursor: grab;
    }
}

.form-row-drag-area {
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin: 1px 0;
    outline: 1px dashed gray;

}

.form-item {
    align-items: center;

    .comp-wrapper {
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding:  5px;
        margin-right: 2px;
        background: aliceblue;
        border-radius: 5px;

        &__sort-btn {
            flex-basis: 20px;
            cursor: move;
        }

        &__input {
            flex: 1 1 auto;
        }

        &__action {
            display: flex;
            flex-basis: 30px;
            flex-direction: column;
            align-items: center;

            .edit-btn {
                cursor: pointer;

                &:hover{
                    color: $color-primary
                }
            }

            .del-btn {
                cursor: pointer;

                &:hover{
                    color: $color-danger
                }
            }
        }
    }

    // outline: 1px dashed;

}

.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

.fade-leave-active {
  position: absolute;
}

.transition-fade {
    display: flex;
    width: 100%;
}
</style>

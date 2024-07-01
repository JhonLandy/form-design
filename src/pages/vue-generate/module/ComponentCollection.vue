<script lang="tsx">
import { isVNode, markRaw } from "vue"
import { type Options, VueDraggable } from "vue-draggable-plus"
import { v4 } from "uuid"
import { ElFormItem, ElIcon } from "element-plus"
import { Link } from "@element-plus/icons-vue"
import { COMPONENT_COLLECTION } from "../config"
import { formatCompName } from "../scripts"
import type { DrageComponent, FormItem, FormRow } from "../typings"
import ProcessComponent from "./ProcessComponent.vue"

export default {

    setup() {
        const components = markRaw<Array<DrageComponent["element"]>>(COMPONENT_COLLECTION)
        const group: Options["group"] = { name: "form", pull: "clone", put: false }
        function dataTransfer(element: DrageComponent["element"]) {
            const row: FormRow = {
                id: Symbol(v4()),
                items: [],
            }
            const item: FormItem = {
                id: Symbol(ElFormItem.name),
                children: {
                    id: isVNode(element)
                        // eslint-disable-next-line ts/ban-ts-comment
                        // @ts-expect-error
                        ? Symbol(element.type.name)
                        // eslint-disable-next-line ts/ban-ts-comment
                        // @ts-expect-error
                        : Symbol(element.name),
                    element: markRaw(element),
                    parent: null as unknown as FormItem,
                },
                parent: row,
            }

            item.children.parent = item
            row.items.push(item)
            return row
        }
        return () => (
            <section class="collection">
                {
                    components.map((Component, index) => {
                        // eslint-disable-next-line ts/ban-ts-comment
                        // @ts-expect-error
                        const compName = formatCompName((Component?.type?.name || Component.name)).replace("el-", "")
                        const link = `https://element-plus.org/zh-CN/component/${compName}.html`
                        const title = `打开${compName}文档链接`
                        return (
                            <section class="collection__item" key={`${compName}-${index}`}>
                                <a style="text-decoration: underline" target="_blank" class="collection__item__label" href={link} title={title}>
                                    <ElIcon><Link /></ElIcon>
                                    {compName}
                                </a>
                                <VueDraggable
                                    modelValue={[Component]}
                                    ghostClass="ghost"
                                    group={group}
                                    sort={false}
                                    clone={dataTransfer}
                                    handle=".collection__item__comp"
                                >
                                    <section class="collection__item__comp">
                                        <ProcessComponent class="collection__item__input" element={Component} />
                                        {/* <section class="comp-drap-btn">
                                            <ElIcon><Sort /></ElIcon>
                                        </section> */}
                                    </section>
                                </VueDraggable>
                            </section>
                        )
                    })
                }
            </section>
        )
    },

}
</script>

<style lang="scss" scoped>
.collection {
    height: 100%;
    padding:0 5px;
    overflow: auto;
}

.collection__item {
    box-sizing: border-box;
    user-select: none;
    transform: scale(0.9);
    transform-origin: top left;

    &__label {
        padding:5px 8px;
        font-size: $font-size-small;
        color: gray;
        transition: .8s;
    }

    &:hover &__label {
        color: $color-primary;
    }

    &__comp {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 200px;
        padding:5px 25px 5px 5px;
        cursor: grab;
        border-radius: 5px;
        transition: .8s;

        .comp-drap-btn {
            cursor: grab;
            visibility: hidden;
            transition: .8s;
            transform: rotate(90deg);
        }

    }

    &:hover &__comp {
            background: aliceblue;

            .comp-drap-btn {
                visibility: visible;
            }
        }

}
</style>

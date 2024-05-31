<script lang="tsx">
import { h, markRaw } from "vue"
import { v4 } from "uuid"
import { type Options, VueDraggable } from "vue-draggable-plus"
import { COMPONENT_COLLECTION } from "../config"

export default {
    setup() {
        type Components = typeof COMPONENT_COLLECTION
        const components = markRaw<Components> (COMPONENT_COLLECTION)
        const group: Options["group"] = { name: "component", pull: "clone", put: false }
        function dataTransfer(element: Record<"name" | "id", string>) {
            return {
                id: v4(),
                element,
            }
        }
        return () =>
            (
                <VueDraggable
                    modelValue={components}
                    ghostClass="ghost"
                    group={group}
                    sort={false}
                    clone={dataTransfer}
                >
                    {components.map((Component) => {
                        return (
                            <div class="collection__item" key={Component.name}>
                                <Component />
                            </div>
                        )
                    })}
                </VueDraggable>
            )
    },

}
</script>

<style lang="scss" scoped>
.collection {
  &__item {
    box-sizing: border-box;
    padding: 5px;
  }
}
</style>

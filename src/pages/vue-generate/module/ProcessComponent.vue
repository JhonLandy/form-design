<script  lang="tsx">
import { cloneVNode, computed, h, isVNode } from "vue"

export default {
    props: ["element", "props"],
    setup(compProps) {
        const vnode = computed(() => {
            const { element, props } = compProps
            return isVNode(element) ? cloneVNode(element, props) : h(element, props)
        })
        return () => vnode.value
    },
}
</script>

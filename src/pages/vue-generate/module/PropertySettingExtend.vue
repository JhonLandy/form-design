<script setup lang="ts">
import { markRaw } from "vue"
import { ElDivider } from "element-plus"
import PropertySetting from "./PropertySetting.vue"

const props = defineProps(["modelValue", "extends"])
const emits = defineEmits(["update:modelValue", "update:extends"])
function uodateModelValue(value: any) {
    emits("update:modelValue", value)
}
function updateExtends(value: any) {
    emits("update:extends", value)
}
</script>

<template>
    <section>
        <PropertySetting :model-value="markRaw(props.modelValue)" @update:model-value="uodateModelValue" />
        <ElDivider content-position="left">
            扩展属性
        </ElDivider>
        <PropertySetting :model-value="markRaw(props.extends)" @update:model-value="updateExtends" />
    </section>
</template>

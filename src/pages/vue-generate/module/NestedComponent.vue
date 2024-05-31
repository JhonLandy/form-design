<script setup lang="ts">
import { VueDraggable } from "vue-draggable-plus"
import { computed, h } from "vue"

interface IList {
    id: string
    name: string
    children: IList[]
}

interface Props {
    modelValue: IList[]
}

const props = defineProps<Props>()

const emits = defineEmits<Emits>()

interface Emits {
    (e: "update:modelValue", value: IList[]): void
}

const list = computed({
    get: () => props.modelValue,
    set: value => emits("update:modelValue", value),
})
</script>

<template>
    <VueDraggable v-model="list" class="drag-area" tag="ul" group="g1">
        <TransitionGroup
            type="transition"
            tag="ul"
            name="fade"
        >
            <ElRow v-for="row in modelValue" :key="row.id">
                <ElFormItem v-for="(comp) in row.children" :key="comp.id" class="collection__item">
                    {{ h(comp) }}
                    <!-- <nested-component v-model="comp.children" /> -->
                </ElFormItem>
            </ElRow>
        </TransitionGroup>
    </VueDraggable>
</template>

  <style scoped>
  .drag-area {
    min-height: 50px;
    outline: 1px dashed;
  }
  </style>

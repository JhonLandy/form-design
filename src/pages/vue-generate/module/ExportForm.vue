<script lang="ts" setup>
import { reactive, ref } from "vue"
import { ElForm } from "element-plus"
import VueLogo from "@/assets/vue.svg?component"

const emits = defineEmits(["submit", "cancel"])
const form = reactive({ name: "" })
const formRef = ref<typeof ElForm>()
function onSubmit() {
    const formIns = formRef.value
    if (formIns) {
        formIns.validate((isPass: boolean) => {
            if (isPass) {
                const name = form.name
                if (!/.*vue$/.test(name)) {
                    form.name = `${name}.vue`
                }
                emits("submit", { ...form })
            }
        })
    }
}
function onCancel() {
    emits("cancel", { ...form })
}
</script>

<template>
    <ElForm ref="formRef" class="export-form" :model="form" label-position="top">
        <el-form-item label="文件名称" prop="name" required>
            <el-input v-model.trim="form.name" placeholder="*.vue" style="width: 370px;">
                <template #prefix>
                    <ElIcon>
                        <VueLogo />
                    </ElIcon>
                </template>
            </el-input>
        </el-form-item>
        <section style="text-align: right">
            <el-button @click="onCancel">
                Cancel
            </el-button>
            <el-button type="primary" @click="onSubmit">
                Confirm
            </el-button>
        </section>
    </ElForm>
</template>

<style lang="scss" scoped>
.export-form {
    width: 100%;
    padding: 10px;
}
</style>

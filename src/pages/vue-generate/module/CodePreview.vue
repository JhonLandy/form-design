<script lang="ts" setup>
import { basicSetup } from "codemirror"
import { EditorView, keymap } from "@codemirror/view"
import { EditorState } from "@codemirror/state"
import { vueLanguage } from "@codemirror/lang-vue"
import { h, onMounted, ref, watch } from "vue"
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands"
import { vscodeDark } from "@uiw/codemirror-theme-vscode"
import { CopyDocument, Download } from "@element-plus/icons-vue"
import { ElIcon, ElMessage, ElMessageBox, ElTooltip } from "element-plus"
import { saveAs } from "file-saver"
import ExportForm from "./ExportForm.vue"

const props = defineProps<{
    content: string
}>()
const cm_view = ref<EditorView>()
/*
* @description 复制代码
*
* */
function copyCode() {
    if (cm_view.value) {
        const text = cm_view.value.state.doc.toString()
        navigator.clipboard.writeText(text)
            .then(() => {
                ElMessage({
                    message: "复制成功",
                    type: "success",
                    plain: true,
                })
            })
    }
}
async function download() {
    const onSubmit = async ({ name }: { name: string }) => {
        if (cm_view.value) {
            const code = cm_view.value.state.doc.toString()
            const file = new File([code], name, { type: "text/plain;charset=utf-8" })
            saveAs(file)
            ElMessageBox.close()
        }
    }

    ElMessageBox({
        message: h(ExportForm, { onSubmit, onCancel: () => ElMessageBox.close() }),
        showConfirmButton: false,
    })
}
onMounted(() => {
    const state = EditorState.create({
        doc: props.content,
        extensions: [
            basicSetup,
            EditorView.lineWrapping,
            EditorView.editable.of(false),
            history(),
            keymap.of([...defaultKeymap, ...historyKeymap]),
            vueLanguage,
            vscodeDark,
        ],
    })
    const ins = new EditorView({
        state,
        parent: document.querySelector("#editor-view") as HTMLElement,
    })
    cm_view.value = ins
    watch(() => props.content, (value) => {
        ins.dispatch({
            changes: {
                from: 0,
                to: state.doc.length,
                insert: value,
            },
        })
    })
})
</script>

<template>
    <div class="markdown-editor">
        <section class="group-btn">
            <ElTooltip content="下载" effect="light">
                <ElIcon class="btn">
                    <Download @click="download" />
                </ElIcon>
            </ElTooltip>
            <ElTooltip content="复制" effect="light">
                <ElIcon class="btn">
                    <CopyDocument @click="copyCode" />
                </ElIcon>
            </ElTooltip>
        </section>
        <div id="editor-view" class="markdown-editor__editor-view" />
    </div>
</template>

<style lang="scss" scoped>
.markdown-editor {
    position: relative;
    height: 500px;
    overflow: auto;
    font-size: 15px;
    border-radius: 5px;

    .group-btn {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 999;
        height: 20px;
        padding: 5px;
        color: $color-primary;
        cursor: pointer;

        .btn {
            margin-right: 5px;
        }
    }

    &__editor-view {
        height: 100%;
        overflow: auto;
        background-color: #fbfbfb;
    }

}
</style>

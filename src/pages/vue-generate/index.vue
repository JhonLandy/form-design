<script setup lang="ts">
import { computed, h, isVNode, onMounted, provide, reactive, ref } from "vue"
import { ElDialog, ElForm, ElFormItem, ElIcon, ElLoading, ElMessageBox } from "element-plus"
import { DArrowRight, Download, View } from "@element-plus/icons-vue"
import { isEmpty, omit } from "ramda"
import type { DrageComponent, FormItem, PropertiesRecord } from "./typings"
import ComponentCollection from "./module/ComponentCollection.vue"
import CreateArea from "./module/CreateArea.vue"
import PropertySetting from "./module/PropertySetting.vue"
import PropertySettingExtend from "./module/PropertySettingExtend.vue"
import CodePreview from "./module/CodePreview.vue"
import Preview from "./module/Preview.vue"
import { generateCode, generateProps, vueFormat } from "./scripts"
import { COMPONENT_DEFAULT_WIDTH } from "./config"

const createAreaRef = ref()
const properties = reactive<PropertiesRecord>({ formRoot: {} })
const extendProps = reactive<PropertiesRecord>({ formRoot: {
    // maxCompNumber: 2,
    compWidth: COMPONENT_DEFAULT_WIDTH,
} })
const curentItemId = ref<symbol>(Symbol(""))
const curentCompId = ref<symbol>(Symbol(""))
const dialogVisible = ref(false)
const previewCode = ref("")
const codePreviewVisible = ref(false)
const drawerVisible = ref(false)
const drawerTabsActive = ref("component-config")
const tabsActive = ref("form-setting")
const formData = computed(() => {
    return createAreaRef.value.rows
})
provide("getSelfProps", (id: symbol) => properties[id])
provide("getCurrentCompType", () => {
    const idStr = curentCompId.value.toString()
    return idStr.replace(/Symbol\((.*)\)/, "$1")
})
function generateProperties(item: FormItem) {
    const children = item.children
    const element = children.element

    const itemId = item.id
    const compId = item.children.id
    const defaultProps = {
        width: 0, // 0 就是auto

    }
    // console.log("item定义的props:", ElFormItem.props)
    if (isVNode(element)) {
        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-expect-error
        // console.log("组件定义的props:", element.type?.props)
        properties[compId] = generateProps(element.type?.props, element.props ?? {})
        extendProps[compId] = defaultProps
    }
    else {
        // console.log("组件定义的props:", element.props)
        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-expect-error
        properties[compId] = generateProps(element.props)
        extendProps[compId] = defaultProps
    }
    properties[itemId] = { ...generateProps(ElFormItem.props), rules: [] }
    setCurrentItem(item)
    setCurrentComp(children)
    // console.log("item组件props vModel对象:", properties[itemId])
    // console.log("生成组件props vModel对象:", properties)
}
function openConfigDrawer(item: FormItem) {
    const children = item.children
    setCurrentItem(item)
    setCurrentComp(children)
    drawerVisible.value = true
}
function setCurrentItem(item: FormItem) {
    curentItemId.value = item.id
}
function setCurrentComp(Comp: DrageComponent) {
    curentCompId.value = Comp.id
}
async function download() {
    // const renderData = createAreaRef.value.rows
    // if (isEmpty(renderData)) {
    //     ElMessageBox.alert("编辑区没有可提交的内容~", "Tip", {
    //         type: "warning",
    //         confirmButtonText: "OK",
    //     })
    //     return
    // }
    // const onSubmit = async (name: string) => {
    //     const ins = ElLoading.service({ text: "正在生成..." })
    //     const result = generateCode(createAreaRef.value.rows, properties, extendProps)
    //     ins.setText("正在格式化...")
    //     const code = await vueFormat(result).finally(() => ins.close())
    //     const file = new File([code], name, { type: "text/plain;charset=utf-8" })
    //     saveAs(file)
    //     ElMessageBox.close()
    //     codePreviewVisible.value = false
    // }

    // ElMessageBox({
    //     message: h(ExportForm, { onSubmit, onCancel: () => dialogVisible.value = false }),
    //     showConfirmButton: false,
    // })

    const renderData = createAreaRef.value.rows
    if (isEmpty(renderData)) {
        ElMessageBox.alert("编辑区没有可提交的内容~", "Tip", {
            type: "warning",
            confirmButtonText: "OK",
        })
        return
    }
    const ins = ElLoading.service({ text: "正在生成..." })
    const result = generateCode(createAreaRef.value.rows, properties, extendProps)
    ins.setText("正在格式化...")
    const code = await vueFormat(result).finally(() => ins.close())
    previewCode.value = code
    codePreviewVisible.value = true
}
async function preview() {
    const renderData = createAreaRef.value.rows
    if (isEmpty(renderData)) {
        ElMessageBox.alert("编辑区没有可预览的内容~", "Tip", {
            type: "warning",
            confirmButtonText: "OK",
        })
        return
    }
    dialogVisible.value = true
}
async function setPreviewCode() {

}
onMounted(() => {
    // console.log("Form 定义的props:", ElForm.props)
    properties.formRoot = generateProps(omit(["rules", "model"], ElForm.props))
    // console.log("生成组件form props vModel对象:", properties.formRoot)
})
ElMessageBox({
    title: "公告",
    message: h("div", [
        h("section", [
            h("h4", "功能："),
            h("p", "1.下载->代码预览"),
            h("p", "2.下载->代码复制"),
            h("p", "3.FormItem配置-> 设置多个校验规则"),
            h("p", "4.组件属性名称中文化"),
        ]),
        h("section", [
            h("h4", "更多功能，请联系邮箱：709364178@qq.com"),
        ]),
        h("span", [
            "Vue3表单设计器, 生成代码主题是element-plus，设计参考：",
            h("a", { style: { color: "#409eff" }, target: "_blank", href: "https://element-plus.org/zh-CN/component/overview.html" }, "https://element-plus.org/zh-CN/component/overview.html"),
        ]),
    ]),
    confirmButtonText: "知道了",
})
</script>

<template>
    <main class="vue-generate">
        <section class="aside-left">
            <ComponentCollection />
        </section>
        <section class="middle">
            <CreateArea
                ref="createAreaRef"
                :properties="properties"
                :extend-properties="extendProps"
                @comp-created="generateProperties"
                @comp-clicked="openConfigDrawer"
            />
        </section>
        <section class="aside-right">
            <el-tabs v-model="tabsActive" class="aside-tabs">
                <el-tab-pane label="表单设置" name="form-setting">
                    <PropertySettingExtend v-model:extends="extendProps.formRoot" v-model="properties.formRoot" />
                </el-tab-pane>
                <el-tab-pane label="导出设置" name="export-setting">
                    <el-button type="primary" size="small" @click="download">
                        <template #icon>
                            <ElIcon>
                                <Download />
                            </ElIcon>
                        </template>
                        下载
                    </el-button>
                    <el-button type="primary" size="small" @click="preview">
                        <template #icon>
                            <ElIcon>
                                <View />
                            </ElIcon>
                        </template>
                        预览
                    </el-button>
                </el-tab-pane>
            </el-tabs>
        </section>
        <ElDrawer
            v-model="drawerVisible"
            :show-close="false"
            :with-header="false"
            size="300"
        >
            <template #default>
                <el-tabs v-model="drawerTabsActive" class="drawer-tabs">
                    <el-tab-pane label="组件配置" name="component-config">
                        <PropertySettingExtend v-model:extends="extendProps[curentCompId]" v-model="properties[curentCompId]" />
                    </el-tab-pane>
                    <el-tab-pane label="FormItem配置" name="field-config">
                        <PropertySetting v-model="properties[curentItemId]" />
                    </el-tab-pane>
                </el-tabs>
                <el-button
                    class="drawer-fold-btn"
                    type="primary"
                    :icon="DArrowRight"
                    circle
                    @click="drawerVisible = false"
                />
            </template>
        </ElDrawer>
        <ElDialog v-model="dialogVisible" title="预览" width="900">
            <Preview :form-data="formData" :properties="properties" :extend-properties="extendProps" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" plain @click="dialogVisible = false">
                        Close
                    </el-button>
                </div>
            </template>
        </ElDialog>
        <ElDialog
            v-model="codePreviewVisible"
            width="900px"
            lock-scroll
            draggable
            @open="setPreviewCode"
        >
            <CodePreview :content="previewCode" />
            <!-- <template #footer>
                <div class="dialog-footer">
                    <el-button plain @click="download">
                        关闭
                    </el-button>
                </div>
            </template> -->
        </ElDialog>
    </main>
</template>

<style lang="scss" scoped>
$aside-left-width: 200px;
$aside-right-width: 280px;
$middle-width: calc(100% - $aside-left-width - $aside-right-width);

.vue-generate {
  display: flex;
  min-width: 800px;
  height: 100%;
}

.middle {
    width: $middle-width;
    height: 100%;
    padding: 5px;
    overflow: auto;
    border-right: 1px solid $color-gray;
    border-left: 1px solid $color-gray;
}

.aside-left {
  display: inline-block;
  width: $aside-left-width;
  height: 100%;
}

.aside-right {
    flex-basis: 280px;
    height: 100%;
    padding: 5px;
    overflow: auto;
}

.aside-tabs, .drawer-tabs {
    ::v-deep(.el-tabs__header) {
        position: sticky!important;
        top: -20px;
        z-index: 1;
        background: $color-white;
    }
}

.drawer-footer {
    padding: 10px 0;
    text-align: left;
    border-top: 2px solid $color-gray;
}

.drawer-fold-btn {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(-50%, -50%);
}

::v-deep(.el-drawer) {
    overflow: visible;
}
</style>

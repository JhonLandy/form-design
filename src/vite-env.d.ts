/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />
/// <reference types="element-plus/global" />

declare module "*.vue" {
    import type { DefineComponent } from "vue"

    const component: DefineComponent
    export default component
}

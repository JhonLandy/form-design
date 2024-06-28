/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />
/// <reference types="element-plus/global" />

declare module "*.vue" {
    import type { DefineComponent } from "vue"

    const component: DefineComponent
    export default component
}

declare module "*.svg" {
    const src: string
    export default src
}
declare module "*.svg?url" {
    const src: string
    export default src
}

declare module "*.svg?raw" {
    const src: string
    export default src
}

declare module "*.svg?skipsvgo" {
    import type { FunctionalComponent, SVGAttributes } from "vue"

    const src: FunctionalComponent<SVGAttributes>
    export default src
}
declare module "*.svg?component" {
    import type { FunctionalComponent, SVGAttributes } from "vue"

    const src: FunctionalComponent<SVGAttributes>
    export default src
}

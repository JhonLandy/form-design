import { cwd } from "node:process"
import { resolve } from "node:path"
import { createRequire } from "node:module"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"
import vueRouter from "unplugin-vue-router/vite"
import vueDevTools from "vite-plugin-vue-devtools"
import { viteMockServe } from "vite-plugin-mock"
import svgLoader from "vite-svg-loader"

const require = createRequire(import.meta.url)
// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "@": resolve(cwd(), "src"),
        },
        extensions: [".js", ".jsx", ".vue", ".ts", ".tsx", ".css", ".sass", ".scss"],
    },
    css: {
        postcss: {
            plugins: [
                require("autoprefixer"),
            ],
        },
        preprocessorOptions: {
            scss: {
                additionalData: `
                    @use "@/styles/extra/variables.scss" as *;
                    @use "@/styles/extra/mixins.scss" as *;
                `,
            },
        },
    },
    server: {
        open: true,
    },
    plugins: [
        svgLoader({
            defaultImport: "url",
        }),
        vueRouter({
            // routesFolder: [
            //     {
            //         src: "src/pages",
            //         path: "/",
            //     },
            // ],
            exclude: ["**/*/module"],
        }),
        vue({
            template: {
                transformAssetUrls: {
                    video: ["src", "poster"],
                    source: ["src"],
                    img: ["src"],
                    image: ["xlink:href", "href"],
                    use: ["xlink:href", "href"],
                },
            },
            isProduction: false,
        }),
        vueJsx(),
        vueDevTools(),
        viteMockServe({ mockPath: "./mock/" }),
    ],
})

import "./styles/index.scss"
import "element-plus/dist/index.css"
import { createApp } from "vue"
import ElementPlus from "element-plus"
import { createI18n } from "vue-i18n"
import router from "./router"
import App from "./App.vue"
import locales from "@/locales/vue.locales.json"

const i18n = createI18n({
    locale: "zh",
    fallbackLocale: "en",
    legacy: false,
    messages: {
        zh: locales.zh,
        en: locales.en,
    },
})
const app = createApp(App)

app.use(i18n)
app.use(router)
app.use(ElementPlus)
app.mount("#app")

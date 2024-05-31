const VueGenerate = () => import(/* webpackChunkName: "vue-generate-Index" */ "./views/Index.vue")

export default [
    {
        name: "vue生成頁面",
        path: "/",
        component: VueGenerate,
    },
]

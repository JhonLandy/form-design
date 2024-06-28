import { ElMessage } from "element-plus"
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"
import axios from "axios"
import { AXIOS_BASE_URL } from "@/common/constants"

interface ResponseData {
    data: object | null
    message: string
    path: string
    statusCode: number
    timestamp: string
}
const instance = axios.create({
    baseURL: AXIOS_BASE_URL,
    timeout: 60000,
})

instance.interceptors.request.use((config) => {
    // config.headers = { Authorization: `Bearer ${getToken()}` } as AxiosRequestHeaders
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    if (["post", "patch"].includes(config.method)) {
        config.data = config.params
        config.params = null
        Object.assign(config.headers, { ContentType: "application/json" })
    }
    return config
})
instance.interceptors.response.use(
    (response) => {
        // const body = (response.data || {}) as ResponseData
        // const code = body.statusCode
        // const isSuccess = /^2\d{2}/
        // if (!isSuccess.test(String(code))) {
        //     const message = body.message || "请求格式不正确"
        //     ElMessage({
        //         message,
        //         type: "warning",
        //         grouping: true,
        //         plain: true,
        //     })
        //     throw message
        // }
        return response.data
    },
    async (error: AxiosError) => {
        const res = error.response as AxiosResponse<ResponseData>
        // 其他非预期错误
        if (!res)
            return Promise.reject(error)
        // http错误
        const status = res.status

        switch (status) {
            case 400:
                ElMessage({
                    message: res.data.message,
                    type: "warning",
                    grouping: true,
                    plain: true,
                })
                break
            case 401:
            //     if (hasToken()) {
            //         try {
            //             // await store.dispatch(USER_ACTION.REFRESH_TOKEN)
            //             return instance.request(error.config)
            //         }
            //         catch {
            //             ElMessage({
            //                 message: "登陆已过期，请重新登陆",
            //                 type: "warning",
            //                 grouping: true,
            //                 plain: true,
            //             })
            //             // store.dispatch(USER_ACTION.LOGOUT)
            //             router.push({ name: "Login" })
            //             return Promise.reject(error)
            //         }
            //     }
            //     else {
            //         ElMessage({
            //             message: res.data.message,
            //             type: "warning",
            //             grouping: true,
            //             plain: true,
            //         })
            //         router.push({ name: "Login" })
            //     }
            //     break
            // case 403:
            //     ElMessage({
            //         message: res.data.message,
            //         type: "error",
            //         grouping: true,
            //         plain: true,
            //     })
            //     break
            // case 404:
            //     ElMessage({
            //         message: `请求地址：'${error.config.url}' 请求不存在`,
            //         type: "error",
            //         grouping: true,
            //         plain: true,
            //     })
                break
            case 500:
                // router.push({
                //     name: "ErrorPage",
                //     params: {
                //         message: encodeURIComponent(`错误码${status}:${res.data.message || res.statusText}`),
                //     },
                // })
                break
            default:
                ElMessage({
                    message: `未知错误：${JSON.stringify(res.data)}`,
                    type: "error",
                    grouping: true,
                    plain: true,
                })
        }

        return Promise.reject(new Error("错误"))
    },
)

type OverrideRequestConfig = Omit<AxiosRequestConfig, "data">

/*
 * @description 发起一个请求
 * @param { AxiosRequestConfig } config 请求配置
 */
export function createRequest<T = any>(config: OverrideRequestConfig) {
    return instance.request<T>(config)
}

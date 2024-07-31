import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { message } from 'antd'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 5000,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token')
    if (accessToken) {
      config.headers.authorization = `Bearer ${accessToken}`
    }
    return config
  },
)

interface PendingTask {
  config: AxiosRequestConfig
  resolve: (value?: unknown) => void
}
let refreshing = false
const queue: PendingTask[] = []

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const { data, config } = error.response
    if (!error.response || (data.code === 401 && config.url.includes('/user/refresh'))) {
      return Promise.reject(error)
    }

    if (refreshing) {
      return new Promise((resolve) => {
        queue.push({
          config,
          resolve,
        })
      })
    }

    if (data.code === 401 && !config.url.includes('/user/refresh')) {
      refreshing = true

      try {
        const res = await refreshToken()
        refreshing = false

        if (res.status === 200 || res.status === 201) {
          queue.forEach(({ config, resolve }) => {
            resolve(axiosInstance(config))
          })

          return axiosInstance(config)
        }
        else {
          message.error(res.data)

          setTimeout(() => {
            window.location.href = '/login'
          }, 1500)
        }
      }
      catch (err) {
        console.error(err)
        refreshing = false
        message.error('登录信息失效')
        setTimeout(() => {
          window.location.href = '/login'
        }, 1500)
      }
    }
    else {
      return error.response
    }
  },
)
async function refreshToken() {
  try {
    const res = await axiosInstance.get('/user/refresh', {
      params: {
        refresh_token: localStorage.getItem('refresh_token'),
      },
    })
    localStorage.setItem('access_token', res.data.access_token || '')
    localStorage.setItem('refresh_token', res.data.refresh_token || '')
    return res
  }
  catch (err) {
    localStorage.clear()
    console.error(err)
    throw err
  }
}

export default axiosInstance

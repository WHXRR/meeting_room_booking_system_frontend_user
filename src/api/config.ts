import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 5000,
})
axiosInstance.interceptors.response.use(
  response => response,
  async (err) => {
    return err.response
  },
)

export default axiosInstance

import axios from "axios"

export const baseURL = import.meta.env.VITE_BACKEND_URL

const instance = axios.create({
  baseURL,
  withCredentials: true,
})

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  },
)

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    console.log("response", response)
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response) {
      console.error("Response error:", error.response.data)
    } else if (error.request) {
      console.error("Request error:", error.request)
    } else {
      console.error("Error", error.message)
    }
    return Promise.reject(error)
  },
)

export default instance

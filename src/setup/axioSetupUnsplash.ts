import axios, { AxiosRequestConfig, AxiosInstance } from 'axios'
const unsplashInitialization = (config: AxiosRequestConfig): AxiosInstance => {
  const axiosInstance = axios.create(config)
  axiosInstance.defaults.baseURL = 'https://api.unsplash.com/'
  /*
        Add default headers, interceptors etc..
    */

  return axiosInstance
}

export const unsplashAxiosRequestConfiguration: AxiosRequestConfig = {
  baseURL: 'https://api.unsplash.com/',
  responseType: 'json',
  headers: {
    Authorization: `Client-ID ${process.env.REACT_APP_UNSPLASH_ACCESS_KEY}`
  }
}

const unsplashInstance = unsplashInitialization(unsplashAxiosRequestConfiguration)

export default unsplashInstance

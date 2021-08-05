import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';
import constant from '../constant/development'
const giphyInitialization = (config: AxiosRequestConfig): AxiosInstance => {
    const axiosInstance = axios.create(config);
    axiosInstance.defaults.baseURL = constant.giphyApiUrl;
    /*
        Add default headers, interceptors etc..
    */

    return axiosInstance;
};


export const giphyAxiosRequestConfiguration: AxiosRequestConfig = {
    baseURL: constant.giphyApiUrl,
    responseType: 'json',
    params:{
        api_key:process.env.REACT_APP_GIPHYKEY!
    },
    headers: {
        'Content-Type': 'application/json',
    },
};

export default giphyInitialization;
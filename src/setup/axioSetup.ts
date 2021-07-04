import axios, { AxiosRequestConfig, AxiosInstance, AxiosPromise } from 'axios';
import constant from '../constant/development'
const initialization = (config: AxiosRequestConfig): AxiosInstance => {
    const axiosInstance = axios.create(config);
    axiosInstance.defaults.baseURL = constant.apiUrl;
    /*
        Add default headers, interceptors etc..
    */

    return axiosInstance;
};

export default initialization;
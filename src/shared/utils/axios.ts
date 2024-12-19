import axios, { AxiosRequestConfig, AxiosResponse, CancelToken } from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // 요청을 보내기 전에 수행할 작업
    return config;
  },
  (error) => {
    // 요청 오류가 있는 작업
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    // 응답 데이터를 가공
    return response;
  },
  (error) => {
    // 응답 오류가 있는 작업
    return Promise.reject(error);
  },
);

export const axiosRequest = async <T>(
  config: AxiosRequestConfig,
  cancelToken?: CancelToken,
): Promise<AxiosResponse<T>> => {
  try {
    const response = await axiosInstance.request<T>({ ...config, cancelToken });
    return response;
  } catch (error) {
    throw error;
  }
};

export const axiosGet = async <T>(
  url: string,
  config?: AxiosRequestConfig,
  cancelToken?: CancelToken,
): Promise<AxiosResponse<T>> => {
  return axiosInstance.get<T>(url, { ...config, cancelToken });
};

export const axiosPost = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
  cancelToken?: CancelToken,
): Promise<AxiosResponse<T>> => {
  return axiosInstance.post<T>(url, data, { ...config, cancelToken });
};

export const axiosPut = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
  cancelToken?: CancelToken,
): Promise<AxiosResponse<T>> => {
  return axiosInstance.put<T>(url, data, { ...config, cancelToken });
};

export const axiosDelete = async <T>(
  url: string,
  config?: AxiosRequestConfig,
  cancelToken?: CancelToken,
): Promise<AxiosResponse<T>> => {
  return axiosInstance.delete<T>(url, { ...config, cancelToken });
};

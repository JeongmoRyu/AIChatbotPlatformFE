import { useState } from 'react';
import axios from 'axios';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { connectionInfoState as useConnectionInfoStore } from '@/shared/store/userinfo';
import { userLoginState as useUserLoginState } from '@/shared/store/onpromise';
// import { useNavigate } from 'react-router-dom';

type HeaderType = {
  'Content-Type'?: string;
};

export const useRestfulCustomAxios = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // const navigate = useNavigate();

  const connectionInfoState = useRecoilValue(useConnectionInfoStore);
  const userLoginState = useRecoilValue(useUserLoginState);
  const resetUserLoginState = useResetRecoilState(useUserLoginState);

  const restfulHeader = {
    'Content-Type': 'application/json',
    //"Access-Control-Allow-Origin": '*',
    Authorization: `Bearer ${userLoginState.accessToken}`,
  };

  const sendRequest = (
    url: string,
    method: 'post' | 'get' | 'put' | 'patch' | 'delete' = 'post',
    headers: HeaderType = restfulHeader,
    data?: unknown,
    params?: any,
  ): Promise<any> => {
    //const baseURL = import.meta.env.VITE_APP_RESTFUL_URL;
    const baseURL = connectionInfoState.chathub.restful;
    setIsLoading(true);

    let config;

    if (method === 'get') {
      config = { method, url: baseURL + url, params, headers };
    } else if (method === 'delete') {
      config = { method, url: baseURL + url, params, data, headers };
    } else {
      config = { method, url: baseURL + url, data, headers };
    }

    const responseData = axios(config)
      .then((responseData) => {
        return responseData;
      })
      .catch((err) => {
        console.log(err);
        if (err) {
          setError(err.message);
          if (err.response) {
            console.log(err.message);
          }
        }
        resetUserLoginState();
        // navigate(SIGN_OUT);
        return null;
      })
      .finally(() => {
        setIsLoading(false);
      });

    return responseData;
  };

  const clearError = () => setError(null);

  return { isLoading, error, sendRequest, clearError };
};

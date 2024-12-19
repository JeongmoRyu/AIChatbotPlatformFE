import { useState } from 'react';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { connectionInfoState as useConnectionInfoStore } from '@/shared/store/userinfo';

type HeaderType = {
  'Content-Type'?: string;
  'Access-Control-Allow-Origin'?: string;
  authorization?: string;
  userId?: string;
};

export const useLoginAxiosHooks = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const connectionInfoState = useRecoilValue(useConnectionInfoStore);

  const restfulHeader = {
    // 'Content-Type': 'application/json',
    'Content-Type': 'application/json',
    // 'Access-Control-Allow-Origin': '*',
  };

  const sendRequestLogin = async (
    url: string,
    method: 'post' | 'get' | 'put' | 'patch' | 'delete' = 'post',
    headers: HeaderType = restfulHeader,
    data?: any,
    withCredentials?: boolean,
  ): Promise<any> => {
    // const baseURL = import.meta.env.VITE_APP_LOGIN_SERVER_URL;
    const baseURL = connectionInfoState.chathub.restful;

    setIsLoading(true);

    console.log('sendRequest URL:' + baseURL + url);
    console.log('restful URL:' + connectionInfoState.chathub.restful);
    console.log('socket URL:' + connectionInfoState.chathub.socket);

    const config = { method, url: baseURL + url, data, headers, withCredentials };
    const responseData = await axios(config)
      .then((responseData) => {
        console.log(responseData);
        return responseData;
      })
      .catch((err) => {
        setError(err.message);
        return null;
      })
      .finally(() => {
        setIsLoading(false);
      });

    return responseData;
  };

  const clearError = () => setError(null);

  return { isLoading, error, sendRequestLogin, clearError };
};

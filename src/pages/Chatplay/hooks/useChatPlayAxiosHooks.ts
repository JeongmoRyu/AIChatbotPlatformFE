import { useState } from 'react';
import axios from 'axios';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userLoginState as useUserLoginStore } from '@/shared/store/onpromise';

import { LOGIN_PATH } from '@/shared/lib/urlPath';
import { showNotification } from '@/shared/utils/common-helper';
import { useTransition } from '@/shared/hooks/useTransition';

import { connectionInfoState as useConnectionInfoStore } from '@/shared/store/userinfo';

type HeaderType = {
  'Content-Type'?: string;
  authorization?: string;
};

export const useChatPlayAxiosHooks = () => {
  const { transNavigate } = useTransition();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [connectionInfoState] = useRecoilState(useConnectionInfoStore);

  const userLoginState = useRecoilValue(useUserLoginStore);

  const restfulHeader = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${userLoginState.accessToken}`,
  };

  const sendRequest = async (
    url: string,
    method: string,
    headers: HeaderType = {},
    body?: any,
    params?: any,
    data?: any,
    timeout?: number,
  ): Promise<any> => {
    const baseURL = `${connectionInfoState.chatplay.restful}`;

    setIsLoading(true);

    const mergeHeaders = { ...restfulHeader, ...headers };

    const config: ConfigType = {
      method,
      url: baseURL + url,
      headers: mergeHeaders,
      params: params,
      data: data,
      timeout,
    };

    if (body) {
      config.data = body instanceof FormData ? body : JSON.stringify(body);
    }

    const responseData = await axios(config)
      .then((responseData) => {
        if (responseData.data.code === 'F002') {
          showNotification('인증되지 않은 사용자입니다', 'error');
          setTimeout(() => {
            transNavigate(LOGIN_PATH);
          }, 1000);
          return null;
        } else {
          return responseData;
        }
      })
      .catch((err) => {
        if (err) {
          setError(err.message);
        }
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

// useTransition

import { useNavigate } from 'react-router-dom';
import { flushSync } from 'react-dom';

import { useDeviceChecker } from './useDeviceChecker';

export const useTransition = () => {
  const navigate = useNavigate();
  const deviceInfo = useDeviceChecker();

  const transNavigate = (url: string | number, obj?: any) => {
    const isViewTransitionSupported = typeof document.startViewTransition === 'function';

    if (deviceInfo.device !== 'w' && deviceInfo.device !== 'm') {
      if (typeof url === 'string') {
        if (obj) {
          navigate(url, obj);
        } else {
          navigate(url as string);
        }
      }
    } else {
      // 지원되지 않는 경우 기본 내비게이션 사용
      if (!isViewTransitionSupported) {
        console.warn('startViewTransition is not supported in this browser.');
        navigate(url as string, obj);
        return;
      }

      // 지원되는 경우 startViewTransition 사용
      document.startViewTransition(() => {
        if (typeof url === 'string') {
          navigate(url, obj && obj);
        } else {
          navigate(-1);
        }
      });
    }
  };

  const transSetState = (func: Function) => {
    if (deviceInfo.device !== 'w' && deviceInfo.device !== 'm') {
      flushSync(func());
    } else {
      document.startViewTransition(() => flushSync(func()));
    }
  };

  return { transNavigate, transSetState };
};

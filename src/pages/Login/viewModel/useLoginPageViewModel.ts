import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '@/shared/utils/common-helper';
import {
  userLoginState as useUserLoginState,
  userAuthority as useUserAuthority,
  chatbotIdState as useChatbotIdState,
} from '@/shared/store/onpromise';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { useLoginAxiosHooks } from '@/shared/hooks/useLoginAxiosHooks';
import { sha512 } from 'js-sha512';
import { sha256 } from 'js-sha256';
import {
  CONNECTING_INFO,
  CONNECTING_INFO_AICHAT,
  CONNECTING_INFO_CHAT_PLAY,
  CONNECTING_INFO_LLM,
} from '@/shared/lib/data';
import { connectionInfoState as useConnectionInfoStore } from '@/shared/store/userinfo';
import { useForm } from 'react-hook-form';

const useLoginPageViewModel = () => {
  const navigate = useNavigate();
  const [textError, setTextError] = useState<string | null>(null);
  const setUserLoginState = useSetRecoilState(useUserLoginState);
  const resetUserLoginState = useResetRecoilState(useUserLoginState);
  const setUserAuthority = useSetRecoilState(useUserAuthority);
  const setChatbotIdState = useSetRecoilState(useChatbotIdState);
  // const hostInfoName = useRecoilValue(useHostInfoName);
  const { sendRequestLogin } = useLoginAxiosHooks();
  const [connectionInfoState, setConnectionInfoState] = useRecoilState(useConnectionInfoStore);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ username: string; password: string }>();

  useEffect(() => {
    resetUserLoginState();
    const hostname = window.location.hostname;
    const port = window.location.port;
    const fullHost = hostname !== 'localhost' ? (port ? `${hostname}:${port}` : hostname) : window.location.hostname;
    console.log('fullHost : ', fullHost);
    const protocol = window.location.protocol;
    const restfulProtocol = protocol === 'https:' ? 'https' : 'http';
    const socketProtocol = protocol === 'https:' ? 'wss' : 'ws';
    if (fullHost) {
      // const connectionInfo = CONNECTING_INFO[fullHost];
      const chathub = CONNECTING_INFO[fullHost] || {
        restful: `${restfulProtocol}://${hostname}:9983`,
        socket: `${restfulProtocol}://${hostname}:9984`,
      };
      const chatplay = CONNECTING_INFO_CHAT_PLAY[fullHost] || {
        restful: `${restfulProtocol}://${hostname}:9201`,
        socket: `${socketProtocol}://${hostname}:9993/chat`,
      };
      const llm = CONNECTING_INFO_LLM[fullHost] || {
        restful: `${restfulProtocol}://${hostname}:9201`,
        socket: `${socketProtocol}://${hostname}:9993/llm-task`,
      };
      const aichat = CONNECTING_INFO_AICHAT[fullHost] || {
        restful: `${restfulProtocol}://${hostname}:9201`,
        socket: `${socketProtocol}://${hostname}:9993/llm`,
      };
      setConnectionInfoState({
        chathub: chathub,
        chatplay: chatplay,
        llm: llm,
        aichat: aichat,
      });
      if (!connectionInfoState.chathub.restful) {
        navigate('/login');
      }
    }
  }, []);

  const fetchEmailLogin = async (params: { username: string; password: string }) => {
    // const APICall = '/user/login';
    const APICall = '/login/email4Sync';
    // const text = textString.toLowerCase();
    const response = await sendRequestLogin(
      APICall,
      'post',
      undefined,
      // {
      //   email: params.username,
      //   // password: sha256(params.password),
      //   password: sha512(params.password),
      // },
      {
        email: params.username,
        password256: sha256(params.password),
        password512: sha512(params.password),
      },
      true,
    );
    if (response && response.status === 200 && response.data) {
      console.log('login response: ', response);
      if (response.data.result || response.data.result === 'ok') {
        if (response.data.data.access_token) {
          const data = response.data.data;
          console.log(`%c AccessToken: ${data.access_token}`, 'color:red');
          console.log(`%c Name: ${data.name}`, 'color:red');
          setUserLoginState((prev) => ({
            ...prev,
            userId: data.user_id,
            email: data.email,
            name: data.name,
            mobile: data.mobile,
            company_name: data.company_name,
            company_id: data.company_id,
            is_company_admin: data.is_company_admin,
            is_company_editor: data.is_company_admin,
            is_company_super_admin: data.is_company_super_admin,
            status: data.status,
            marketing_agreement_type: data.marketing_agreement_type,
            expiredDate: data.expiredDate,
            refreshToken: data.refresh_token,
            accessToken: data.access_token,
            joinType: data.join_type,
            userType: data.user_type,
            company_registration_number: data.company_registration_number,
            default_chatbot_id: data.default_chatbot_id,
            user_key: data.user_key,
          }));

          if (data.access_token && data.is_company_super_admin) {
            setUserAuthority('superAdmin');
          } else if (data.access_token && data.is_company_admin) {
            setUserAuthority('admin');
          } else if (data.access_token && data.is_company_editor) {
            setUserAuthority('editor');
          } else {
            setUserAuthority('');
          }

          setChatbotIdState(data.default_chatbot_id);
          navigate('/home');
        }
      } else {
        showNotification(response.data.message, 'error');
        return;
      }
    }
  };

  const onSubmit = (data: { username: string; password: string }) => {
    setTextError(null);
    const params = { username: data.username, password: data.password };
    console.log(params);
    fetchEmailLogin(params);
    // fetchEmailLogin(params, hostInfoName);
  };

  return {
    register,
    handleSubmit,
    errors,
    textError,
    onSubmit,
  };
};
export default useLoginPageViewModel;

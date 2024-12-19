import { useRestfulCustomAxios } from '@/shared/hooks/useRestfulCustomAxios';
import { showNotification } from '@/shared/utils/common-helper';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useLayoutChathubViewModel = () => {
  const navigate = useNavigate();
  const { sendRequest } = useRestfulCustomAxios();

  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const [logData, setLogData] = useState<IDashBoardLogs>({
    total_time: 0,
    logs: [],
    chatbot_id: 0,
    prompt_1: '',
    prompt_2: '',
  });

  const handleChatLog = async (chatroomId: number, seqNum: string | number | string[]) => {
    // console.log('rightsidebar', isOpen);
    // console.log('click', chatroomId, seqNum);
    await getDashboardlogs(chatroomId, seqNum);
    !isOpen && setIsOpen((prev) => !prev);
    // console.log('rightsidebar', isOpen);
  };

  const getDashboardlogs = async (chatroomId: number, seqNum: string | number | string[]) => {
    const response = await sendRequest(`/testlog/${chatroomId}/${seqNum}`, 'get');
    if (response && response.data.data) {
      if (response.data.data.code !== 'F002') {
        setLogData(response.data.data);
      } else {
        showNotification(response.data.message, 'error');
        navigate('/login');
      }
    } else {
      showNotification('채팅 로그 획득에 오류가 발생하였습니다', 'error');
    }
  };

  return { isOpen, setIsOpen, toggleSidebar, logData, getDashboardlogs, handleChatLog };
};

export default useLayoutChathubViewModel;

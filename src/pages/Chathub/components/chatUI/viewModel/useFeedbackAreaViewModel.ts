import { useRestfulCustomAxios } from '@/shared/hooks/useRestfulCustomAxios';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userLoginState, roomInfoState as useRoomInfoState } from '@/shared/store/onpromise';
import { showNotification } from '@/shared/utils/common-helper';

const useFeedbackAreaViewModel = ({ index, seq, isOpen, handleFeedbackArea }: FeedbackAreaProps) => {
  const { sendRequest } = useRestfulCustomAxios();
  const [feedbackContents, setFeedbackContents] = useState<string>('');
  const feedbackRef = useRef<HTMLTextAreaElement>(null);
  const [roomInfoState] = useRecoilState(useRoomInfoState);
  const navigate = useNavigate();
  const userState = useRecoilValue(userLoginState);
  const userName = useMemo(() => userState?.email, [userState]);

  useEffect(() => {
    if (isOpen && feedbackRef.current) {
      feedbackRef.current.scrollIntoView({ behavior: 'smooth' });
      feedbackRef.current.focus();
    }
  }, [isOpen]);

  const handleChangeFeedback = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedbackContents(e.target.value);
  };

  const handleSendFeedback = async () => {
    await postFeedbackContent(roomInfoState.roomId, seq, feedbackContents, userName);
  };

  const postFeedbackContent = async (chatroom_id: number, seq: number, feedbackContent: string, userName: string) => {
    const response = await sendRequest(
      `/chatroom/feedback/${chatroom_id}/${seq}?feedback=${feedbackContent}&user_name=${userName}`,
      'post',
      undefined,
      undefined,
      undefined,
    );
    if (response && response.data) {
      if (response.data.code !== 'F002') {
        setFeedbackContents('');
        handleFeedbackArea(index);
        showNotification('피드백 전송에 성공하였습니다.', 'success');
      } else {
        showNotification(response.data.message, 'error');
        navigate('/login');
      }
    } else {
      showNotification('피드백 전송에 오류가 발생하였습니다', 'error');
      return;
    }
  };

  // if (!isOpen) return null;
  if (!isOpen)
    return { feedbackRef: null, feedbackContents: '', handleChangeFeedback: () => {}, handleSendFeedback: () => {} };

  return {
    feedbackRef,
    feedbackContents,
    handleChangeFeedback,
    handleSendFeedback,
  };
};

export default useFeedbackAreaViewModel;

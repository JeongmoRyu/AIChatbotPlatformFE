import { motion } from 'framer-motion';

import ChatPlayChatUI from './ChatPlayChatUI';
import ChatPlayNameSelect from './ChatPlayNameSelect';
import ChatPlayPipelineFlow from './ChatPlayPipelineFlow';
import ChatPlayUI from './ChatPlayUI';
import PromptBox from './PromptBox';

import useChatplayModel from '../model/useChatplayModel';

const PageChatplay = () => {
  const { socket, ChatPlayChatHistoryState, sendMessage } = useChatplayModel();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex w-full h-full gpt"
    >
      <div className="flex flex-col justify-between flex-grow h-full bg-box-default">
        <ChatPlayNameSelect socket={socket} />
        {/* <ChatPlayUI/> */}
        <ChatPlayUI isHidden={ChatPlayChatHistoryState.history.length > 0} />
        <ChatPlayChatUI isShow={ChatPlayChatHistoryState.history.length > 0} />
        {/* Input Area */}
        <PromptBox sendMessage={sendMessage} socket={socket} />
      </div>

      {/* 설정 및 테스트로그 파이프라인 */}
      <ChatPlayPipelineFlow socket={socket} />
    </motion.div>
  );
};

export default PageChatplay;

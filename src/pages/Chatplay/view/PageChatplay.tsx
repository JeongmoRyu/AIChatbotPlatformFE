import ChatPlayChatUI from './ChatPlayChatUI';
import ChatPlayNameSelect from './ChatPlayNameSelect';
import ChatPlayPipelineFlow from './ChatPlayPipelineFlow';
import ChatPlayUI from './ChatPlayUI';
import PromptBox from './PromptBox';

import useChatplayModel from '../model/useChatplayModel';

const PageChatplay = () => {
  const { socket, ChatPlayChatHistoryState, sendMessage } = useChatplayModel();

  return (
    // <div className="flex flex-row h-[calc(100vh)]">
    //   <div className="flex flex-col justify-between flex-grow bg-box-default">
    <div className="flex h-full gpt">
      <div className="flex flex-col justify-between flex-grow h-full bg-box-default">
        <ChatPlayNameSelect />
        {/* <ChatPlayUI/> */}
        <ChatPlayUI isHidden={ChatPlayChatHistoryState.history.length > 0} />
        <ChatPlayChatUI isShow={ChatPlayChatHistoryState.history.length > 0} />
        {/* Input Area */}
        <PromptBox sendMessage={sendMessage} />
      </div>

      {/* 설정 및 테스트로그 파이프라인 */}
      <ChatPlayPipelineFlow socket={socket} />
    </div>
    // </div>
  );
};

export default PageChatplay;

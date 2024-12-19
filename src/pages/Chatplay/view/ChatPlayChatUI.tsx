import { ColorRing } from 'react-loader-spinner';

import ChatPlayUserChat from './ChatPlayUserChat';
import ChatPlayGptChat from './ChatPlayGptChat';

import useChatPlayChatUIViewModel from '../viewModel/useChatPlayChatUIViewModel';

interface ChatItemProps {
  item: any;
  index: number;
}

const ChatItem = ({ item, index }: ChatItemProps) => {
  const isUser = item.role === 'user';
  const isMarginTop = index !== 0;

  return (
    <>
      {isUser ? (
        <ChatPlayUserChat key={`chat_${index}`} index={index} chatData={item.content} isMarginTop={isMarginTop} />
      ) : (
        <ChatPlayGptChat key={`chat_${index}`} index={index} chatData={item.content} retriever={item.retriever} />
      )}
    </>
  );
};

function ChatPlayChatUI({ isShow }: { isShow: boolean }) {
  const { refScroll, ChatPlayChatHistoryState, ChatPlayChatHistoryStreamState } = useChatPlayChatUIViewModel();

  return (
    <div
      ref={refScroll}
      className={`overflow-y-auto mt-2 py-4 max-h-[calc(100vh-20rem)] px-5 h-full ${isShow ? 'block' : 'hidden'}`}
    >
      <ul className="flex flex-col max-w-full xl:max-w-[55rem] mx-auto text-[#111111] text-base text-left break-keep">
        {ChatPlayChatHistoryState &&
          ChatPlayChatHistoryState.history.map((item, index) => <ChatItem key={index} item={item} index={index} />)}
        {ChatPlayChatHistoryStreamState.answer && (
          <ChatItem
            key={`stream_${new Date().getTime()}`}
            item={{
              role: 'assistant',
              content: ChatPlayChatHistoryStreamState.answer,
            }}
            index={-1}
          />
        )}
        <div className="flex justify-center">
          <ColorRing
            visible={ChatPlayChatHistoryStreamState.isLoading}
            height="80"
            width="80"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            colors={['#187BCC', '#EC504B', '#FBAF07', '#87B236', '#444444']}
          />
        </div>
      </ul>
    </div>
  );
}

export default ChatPlayChatUI;

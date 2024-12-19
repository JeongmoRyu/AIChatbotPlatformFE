import PromptBox from '../components/Chat/view/PromptBox';
import GptGuide from '../components/chatRoomGuide/view/GptGuide';
import usePageChatRoomViewModel from '../viewModel/usePageChatRoomViewModel';
// import { LOGIN } from 'data/routers';

const PageChatRoom = () => {
  usePageChatRoomViewModel();
  return (
    <div className="flex flex-row w-full h-full">
      {/* content */}
      <div className="flex flex-col items-center justify-center w-full h-full bg-slate-100 scrollbar-hide overflow-y-auto">
        <div className="flex flex-col w-full max-w-[62rem] h-full pb-[50px]">
          <GptGuide />
          <PromptBox />
        </div>
      </div>
    </div>
  );
};

export default PageChatRoom;

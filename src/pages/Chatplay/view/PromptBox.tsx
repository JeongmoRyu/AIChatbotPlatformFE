import usePromptBoxViewModel from '../viewModel/usePromptBoxViewModel';

import icoSingleOn from '@/shared/assets/images/image/chatplay/ico_single_on.svg';
import icoSingle from '@/shared/assets/images/image/chatplay/ico_single.svg';
import icoMultiOn from '@/shared/assets/images/image/chatplay/ico_multi_on.svg';
import icoMulti from '@/shared/assets/images/image/chatplay/ico_multi.svg';

import { useTranslation } from 'react-i18next';

function PromptBox({
  sendMessage,
  socket,
}: {
  sendMessage: (data: ChatPlayHistoryType | null) => void;
  socket: ChatPlayHistoryType;
}) {
  const { t } = useTranslation(['chatplay']);
  const {
    roomInfoState,
    handleClickGptTurnType,
    refChatContainer,
    containerStyle,
    requestText,
    refChatBox,
    handleOnChangeChat,
    handleOnKeyDown,

    handleSendMessage,
    isLoading,
    isChatDisabled,
  } = usePromptBoxViewModel({ sendMessage, socket });

  return (
    <div className="input pb-11">
      <div className="flex relative max-w-[90%] xl:max-w-[55rem] mx-auto items-center justify-end mb-3">
        <div className="flex">
          <button
            name="Single"
            className={`flex items-center py-1.5 px-4 border rounded-l-full 
                  ${roomInfoState.gptTurnType === 'Single' ? 'border-primary-darkblue' : 'border-bd-default-gray'}`}
            onClick={handleClickGptTurnType}
          >
            {roomInfoState.gptTurnType === 'Single' ? (
              <img src={icoSingleOn} alt="singleOn" />
            ) : (
              <img src={icoSingle} alt="singleOff" />
            )}
            <p
              className={`ml-1 font-medium ${
                roomInfoState.gptTurnType === 'Single' ? 'text-primary-darkblue' : 'text-dark'
              }`}
            >
              Single
            </p>
          </button>
          <button
            name="Multi"
            className={`flex items-center py-1.5 px-4 border rounded-r-full 
                  ${roomInfoState.gptTurnType === 'Multi' ? 'border-primary-darkblue' : 'border-bd-default-gray'}`}
            onClick={handleClickGptTurnType}
          >
            {roomInfoState.gptTurnType === 'Multi' ? (
              <img src={icoMultiOn} alt="multiOn" />
            ) : (
              <img src={icoMulti} alt="multiOff" />
            )}
            <p
              className={`ml-1 font-medium ${
                roomInfoState.gptTurnType === 'Multi' ? 'text-primary-darkblue' : 'text-dark'
              }`}
            >
              Multi
            </p>
          </button>
        </div>
      </div>

      <div
        ref={refChatContainer}
        className="flex relative max-w-[90%] xl:max-w-[55rem] min-h-[66px] mx-auto border border-[#d0d9e3] rounded-xl shadow-md shadow-[#122c4826] bg-white items-center"
        style={containerStyle}
      >
        <div className="flex items-center w-full h-full">
          <textarea
            id="chatbox"
            ref={refChatBox}
            value={requestText}
            rows={1}
            className="w-full h-full px-10 bg-transparent border-0 border-none outline-none resize-none max-h-60 focus:ring-0 focus:border-none mobile:px-5"
            onChange={handleOnChangeChat}
            onKeyDown={handleOnKeyDown}
            placeholder={
              isChatDisabled
                ? t('chatplay:챗봇_목록에서_챗봇을_선택하거나_신규_챗봇을_등록한_뒤_대화가_가능합니다')
                : (t('chatplay:대화를_입력해주세요') as string)
            }
          />

          <div className={`flex items-center w-[90px]`}>
            <button
              type="submit"
              className={`w-10 h-10 bg-[url(@/shared/assets/images/image/chatplay/ico_send.svg)] bg-no-repeat bg-center bg-contain ${isLoading || isChatDisabled ? `cursor-not-allowed` : `cursor-pointer`}`}
              disabled={isLoading}
              onClick={handleSendMessage}
            ></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PromptBox;

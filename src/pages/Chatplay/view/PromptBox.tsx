import usePromptBoxViewModel from '../viewModel/usePromptBoxViewModel';

import icoSingleOn from '@/shared/assets/images/image/chatplay/ico_single_on.svg';
import icoSingle from '@/shared/assets/images/image/chatplay/ico_single.svg';
import icoMultiOn from '@/shared/assets/images/image/chatplay/ico_multi_on.svg';
import icoMulti from '@/shared/assets/images/image/chatplay/ico_multi.svg';
import EditIcon from '@/shared/assets/images/image/chatplay/ico_edit.svg';
import CheckIcon from '@/shared/assets/images/image/chatplay/ico_check.svg';
import AddChatIcon from '@/shared/assets/images/image/chatplay/ico_add_chat.svg';
import AddChatIconDisabled from '@/shared/assets/images/image/chatplay/ico_add_chat_disabled.svg';
import { useTranslation } from 'react-i18next';

function PromptBox({ sendMessage }: { sendMessage: (data: ChatPlayHistoryType | null) => void }) {
  const { t } = useTranslation(['chatplay']);
  const {
    isVisible,
    isEditable,
    handleOnClickEdit,
    roomInfoState,
    handleClickGptTurnType,
    refChatContainer,
    containerStyle,
    requestText,
    refChatBox,
    handleOnChangeChat,
    handleOnKeyDown,
    handleChatHistory,
    handleSendMessage,
    isLoading,
    isChatDisabled,
  } = usePromptBoxViewModel(sendMessage);

  return (
    <div className="input pb-11">
      <div className="flex relative max-w-[90%] xl:max-w-[55rem] mx-auto items-center justify-end mb-3">
        {isVisible && (
          <div className="absolute flex justify-center transform -translate-x-1/2 left-1/2">
            <button
              className={`flex justify-center items-center text-sm w-[114px] h-11 rounded border border-set-border ${
                isEditable ? 'bg-primary-darkblue text-white' : 'bg-white text-dark'
              }`}
              onClick={handleOnClickEdit}
            >
              <img className="mr-1.5" src={isEditable ? CheckIcon : EditIcon} alt={isEditable ? 'check' : 'edit'} />
              {isEditable ? t('chatplay:대화_저장') : t('chatplay:대화_편집')}
            </button>
          </div>
        )}
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
            placeholder={t('chatplay:대화를_입력해주세요') as string}
          />
          <div className={`flex items-center  ${isVisible ? 'w-[90px]' : 'w-[52px]'}`}>
            {isVisible && (
              <button
                onClick={handleChatHistory}
                disabled={requestText.length === 0}
                className={`mr-3 ${requestText.length > 0 ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              >
                <img
                  src={requestText.length > 0 ? AddChatIcon : AddChatIconDisabled}
                  alt={requestText.length > 0 ? 'addChat' : 'addChatDisabled'}
                />
              </button>
            )}
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

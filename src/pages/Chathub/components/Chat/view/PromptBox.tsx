import ico_send_on from '@/shared/assets/images/icons/ico_send_on.svg';
import ico_send from '@/shared/assets/images/icons/ico_send.svg';
import usePromptBoxViewModel from '../viewModel/usePromptBoxViewModel';

const PromptBoxView = () => {
  const {
    requestPrompt,
    handleOnChangeChat,
    handleOnKeyDown,
    roomStatusState,
    isMakingQuestions,
    promptBoxStyle,
    handleClickSendRequest,
  } = usePromptBoxViewModel();
  return (
    <div className="relative flex flex-col justify-center items-center text-sm bg-slate-100 w-full h-[64px] mt-[10px]">
      <textarea
        id="promptbox"
        value={requestPrompt}
        className="prompt-box"
        placeholder="AI Chat에게 질문 또는 요청을 해보세요"
        onChange={handleOnChangeChat}
        onKeyDown={handleOnKeyDown}
        disabled={roomStatusState.chatUiState === 'ING' || isMakingQuestions}
        style={promptBoxStyle}
      />
      <button
        type="button"
        className={`absolute right-[15px] top-0 bottom-0 w-10 h-10 my-[auto] rounded-full ${isMakingQuestions ? 'cursor-not-allowed opacity-50' : 'hover:cursor-pointer'}  ${requestPrompt.trim() && 'bg-primary'}`}
        onClick={handleClickSendRequest}
        disabled={roomStatusState.chatUiState === 'ING' || isMakingQuestions}
      >
        {requestPrompt.trim() ? (
          <img src={ico_send_on} alt="send on" />
        ) : (
          <img
            src={ico_send}
            alt="send"
            style={{
              filter: 'invert(67%) sepia(97%) saturate(6854%) hue-rotate(225deg) brightness(100%) contrast(100%)',
            }}
          />
        )}
      </button>
    </div>
  );
};

export default PromptBoxView;

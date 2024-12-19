import ReactJson from 'react-json-view';
import useChatPlayTestLogViewModel from '../viewModel/useChatPlayTestLogViewModel';
import { useTranslation } from 'react-i18next';

function ChatPlayTestLog() {
  const { t } = useTranslation(['chatplay']);

  const { ChatPlayChatHistoryState, ChatPlayChatTimelineState, refPipeLineSideScroll } = useChatPlayTestLogViewModel();

  return (
    <div className="flex flex-col justify-center items-center w-[30rem] h-[calc(100vh-8rem)] px-10 py-5 border-l border-l-[#d0d9e3]">
      {/* 입력이 없을 경우 */}
      <div className={ChatPlayChatHistoryState.history.length > 0 ? 'hidden' : 'block'}>
        <p className="pt-20 bg-[url(@/shared/assets/images/image/chatplay/ico_maumGPT_flow.svg)] bg-no-repeat bg-[center_top] text-text-gray text-base">
          {t('chatplay:이곳에서_Pipeline_flow를_확인할_수_있습니다')}
        </p>
      </div>

      {/* 파이프라인이 나올 경우 */}
      <div className={`flex-col w-full h-full ${ChatPlayChatHistoryState.history.length > 0 ? 'flex' : 'hidden'}`}>
        <div className="relative pr-5 pl-12 py-4 rounded-2xl bg-primary-darkblue bg-[url(@/shared/assets/images/image/chatplay/ico_play.svg)] bg-no-repeat bg-[top_1rem_left_1.25rem]">
          <div className="text-base text-white break-keep">
            {ChatPlayChatTimelineState.timeline.length > 0 && <p>{ChatPlayChatHistoryState.history[0]?.content}</p>}
          </div>
        </div>

        <div className="relative max-h-[42.5rem] h-[calc(100%-17.5rem)] my-2.5 rounded-2xl bg-[#171e2e] before:absolute before:-top-5 before:left-[1.85rem] before:h-[calc(100%+2.4rem)] before:border-l before:border-l-primary-darkblue">
          <div ref={refPipeLineSideScroll} className="relative h-full py-5 pr-5 overflow-x-hidden overflow-y-auto">
            {ChatPlayChatTimelineState &&
              ChatPlayChatTimelineState.timeline.map((chatitem, chatindex) => (
                <div key={`${chatitem.dataTitle}-${chatindex}`} className="timeline-item">
                  <div className="mb-2.5 pl-12 bg-[url(@/shared/assets/images/image/chatplay/ico_done.svg)] bg-no-repeat bg-[center_left_1.25rem] text-white text-base font-bold">
                    {chatitem.dataTitle || t('chatplay:선택해주세요')}
                  </div>
                  <div className="mb-7 ml-12 px-5 py-4 rounded-lg bg-slate-300 text-[#171e2e] text-sm break-keep response-box">
                    <div className="break-words whitespace-pre-line">
                      {chatindex % 2 === 1 ? (
                        chatitem.response
                      ) : (
                        <ReactJson
                          src={
                            typeof chatitem.response === 'string' ? JSON.parse(chatitem.response) : chatitem.response
                          }
                          style={{ wordBreak: 'break-all' }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="relative pr-5 pl-12 py-4 rounded-2xl bg-primary-darkblue bg-[url(@/shared/assets/images/image/chatplay/ico_smile.svg)] bg-no-repeat bg-[top_1rem_left_1.25rem]">
          <span className="text-base font-bold text-white">{t('chatplay:완료')}</span>
        </div>
      </div>
    </div>
  );
}

export default ChatPlayTestLog;

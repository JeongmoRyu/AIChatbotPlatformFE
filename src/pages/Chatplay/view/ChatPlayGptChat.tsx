import MDChatMessage from '../view/MDChatMessage';

import DeleteIcon from '@/shared/assets/images/image/chatplay/ico_delete_chat.svg';
import ArrowIcon from '@/shared/assets/images/image/chatplay/ico_close@2x.png';
import useChatPlayGptChatViewModel from '../viewModel/useChatPlayGptChatViewModel';
import { useTranslation } from 'react-i18next';

interface IRetrieverProps {
  index: number;
  item: IRetrieverSource;
  isOpenAccordion: boolean[];
  toggleAccordion: (index: number) => void;
}

function RetrieverItem({ index, item, isOpenAccordion, toggleAccordion }: IRetrieverProps) {
  const { t } = useTranslation(['chatplay']);
  return (
    <div key={index} className="bg-normal-hover px-5 py-3 rounded-[10px] mb-2">
      <div className="flex justify-between">
        <div className="flex items-center">
          <div className="mr-2 text-sm">{item.metadata.file_name}</div>
          <div className="text-xs">
            ({t('chatplay:출처_페이지')}: {item.metadata.page} / {t('chatplay:전체_페이지')}: {item.metadata.total_page}
            )
          </div>
        </div>
        <div>
          <img
            src={ArrowIcon}
            alt="arrow"
            className={`w-5 h-5 ml-1 transition-transform duration-300 cursor-pointer ${
              !isOpenAccordion[index] ? 'rotate-180' : ''
            }`}
            onClick={() => toggleAccordion(index)}
          />
        </div>
      </div>
      {isOpenAccordion[index] && (
        <>
          <div className="my-3 border border-set-border"></div>
          <div className="text-xs whitespace-pre-wrap">{item.page_content}</div>
        </>
      )}
    </div>
  );
}

function ChatPlayGptChat({
  index,
  chatData,
  retriever,
}: {
  index: number;
  chatData: string | any;
  retriever: IRetrieverSource[];
}) {
  const { t } = useTranslation(['chatplay']);

  const {
    chatPlayChatTimelineState,
    isOpenAccordion,
    toggleAccordion,
    handleClickEvent,
    roomInfo,

    ChatPlayChatLinkUrlState,
    handleDeleteIcon,
  } = useChatPlayGptChatViewModel();

  return (
    <>
      <li className="w-[40rem] mt-10 tablet:w-full tablet:max-w-[40rem]">
        <div className="flex items-center font-bold h-8 mb-2.5 pl-10 bg-[url(@/shared/assets/images/image/chatplay/ico_assistant.svg)] bg-no-repeat bg-[left_center]">
          {chatPlayChatTimelineState.timeline[1]?.dataTitle}
        </div>
        <div className="w-full px-10 py-[30px] rounded-3xl bg-white relative">
          <MDChatMessage index={index} text={chatData as string} />
          {retriever?.length > 0 && (
            <div className="mt-6">
              <div className="mb-2 text-sm">{t('chatplay:출처')}</div>
              {retriever.map((item: IRetrieverSource, index: number) => (
                <RetrieverItem
                  key={index}
                  index={index}
                  item={item}
                  isOpenAccordion={isOpenAccordion}
                  toggleAccordion={toggleAccordion}
                />
              ))}
            </div>
          )}
          <div className={`w-full flex flex-row ${typeof chatData === 'string' && 'hidden'}`}>
            {typeof chatData !== 'string' &&
              chatData.actions &&
              chatData.actions.map((item: any) => (
                <button
                  key={item.id}
                  type="button"
                  data-url={item.data}
                  className="px-4 py-3 mr-2 rounded-lg bg-normal-border hover:bg-primary-light"
                  onClick={handleClickEvent}
                >
                  {item.name}
                </button>
              ))}
          </div>
          {roomInfo.state === 'EDITABLE' && (
            <img
              src={DeleteIcon}
              alt="delete_chat"
              className="absolute top-[40px] right-[-30px] cursor-pointer"
              onClick={() => handleDeleteIcon(index)}
            />
          )}
        </div>
      </li>

      <ul className="flex flex-row items-center justify-between max-w-xl mt-5">
        {ChatPlayChatLinkUrlState &&
          ChatPlayChatLinkUrlState.length > 0 &&
          ChatPlayChatLinkUrlState.map((item: any, index: number) => (
            <li key={index}>
              <div
                data-url={item}
                className="px-4 py-2 font-semibold text-black rounded-full cursor-pointer bg-slate-300"
                onClick={handleClickEvent}
              >
                {`${t('chatplay:관련링크')} ${index + 1}`}
              </div>
            </li>
          ))}
      </ul>
    </>
  );
}
export default ChatPlayGptChat;

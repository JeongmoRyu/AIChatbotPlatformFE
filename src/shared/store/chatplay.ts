import { atom } from 'recoil';

const ChatPlayChatHistoryState = atom<ChatPlayHistoryInfo>({
  key: 'ChatPlayChatHistoryState',
  default: {
    history: [],
  },
});

const selectedQuestion = atom<string>({
  key: 'selectedQuestion',
  default: '',
});

const chatbotDataChatPlay = atom<IChatbotDataItemChatplay[]>({
  key: 'chatbotDataChatPlay',

  default: [],
});

const roomInfoStateChatplay = atom<IRoomInfoChatPlay>({
  key: 'roomInfoStateChatplay',
  default: {
    state: 'UNEDITABLE',
    checkId: 0,
    gptTurnType: 'Single',
    isMakingQuestions: false,
    chatUiState: 'READY',
    chatbotType: 'RAG',
  },
});

const ChatPlayChatTimelineState = atom<ChatPlayTimelineInfo>({
  key: 'ChatPlayChatTimelineState',
  default: {
    timeline: [],
  },
});

const ChatPlayChatHistoryStreamState = atom<any>({
  key: 'ChatPlayChatHistoryStreamState',
  default: {
    isLoading: false,
    answer: '',
  },
});

type TChatPlayTab = 'setting' | 'testlog';

const chatPlayTabInfoState = atom<TChatPlayTab>({
  key: 'chatPlayTabInfoState',
  default: 'setting',
});

const ChatPlayChatLinkUrlState = atom<string[]>({
  key: 'ChatPlayChatLinkUrlState',
  default: [],
});

const chatPlayEngineData = atom<chatPlayEngineData>({
  key: 'chatPlayEngineData',
  default: {
    llm: [],
    rag: [],
  },
});

const llmEngineListA = atom<any[]>({
  key: 'llmEngineListA',
  default: [
    {
      label: '',
      value: 0,
    },
  ],
});

const retrievalCreate = atom<boolean>({
  key: 'retrievalCreate',
  default: false,
});

const isChatLoading = atom<boolean>({
  key: 'isChatLoading',
  default: false,
});

export {
  ChatPlayChatHistoryState,
  selectedQuestion,
  chatbotDataChatPlay,
  roomInfoStateChatplay,
  ChatPlayChatTimelineState,
  ChatPlayChatHistoryStreamState,
  chatPlayTabInfoState,
  ChatPlayChatLinkUrlState,
  chatPlayEngineData,
  retrievalCreate,
  llmEngineListA,
  isChatLoading,
};

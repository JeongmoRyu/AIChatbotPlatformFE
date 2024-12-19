interface ChatPlayHistoryInfo {
  history: ChatPlayHistoryType[];
}

interface IChatbotDataItemChatplay {
  chatbot_id: number;
  name: string;
  type: TEngineType;
  system_prompt: string;

  llm_workflow_id: number;

  llm_configs: any;
  retriever_id: number;
  retriever_top_k: number | null;
}

type TChatPlayTab = 'setting' | 'testlog';

type TRoomStateChatPlay = 'EDITABLE' | 'UNEDITABLE';
type TChatUiStateChatPlay = 'READY' | 'CHAT';

interface IChatPlayQuestions {
  question: string;
}

interface IRoomInfoChatPlay {
  state: TRoomStateChatPlay;
  checkId: number | string;
  gptTurnType: 'Single' | 'Multi';
  isMakingQuestions?: boolean; ////////
  chatUiState: TChatUiStateChatPlay;
  chatbotType: 'RAG';
}

interface Range {
  from: number;
  to: number;
}

interface ConfigParameter {
  name: string;
  range: Range;
  required: boolean;
  default_value: number | string;
  info: string;
  engInfo: string;
}

interface Config {
  top_k: ConfigParameter;
  top_p: ConfigParameter;
  temperature: ConfigParameter;
  presence_penalty: ConfigParameter;
  frequency_penalty: ConfigParameter;
}

type RefinedConfig = {
  [key in keyof Config]: string;
};

interface LLMEngine {
  llm_workflow_id: number;
  name: string;
  config: Config;
}

interface RAGEngine {
  label: string;
  value: number;
}
interface chatPlayEngineData {
  llm: LLMEngine[];
  rag: RAGEngine[];
}

interface ChatPlayTimelineType {
  [key: string]: string;
}

interface ChatPlayTimelineInfo {
  timeline: ChatPlayTimelineType[];
}

interface ChatPlayHistoryType {
  role: string;
  content: string;
  retriever?: IRetrieverSource[];
}

interface ChatPlayModalProps {
  onClose: (e?: React.MouseEvent<HTMLElement>) => void;
  className?: string;
  isShowBackdrop?: boolean;
}

interface ChatPlayHistoryInfo {
  history: ChatPlayHistoryType[];
}

interface IResponseError {
  code: string;
  message: string;
  result: boolean;
}

interface IRetrieverSource {
  page_content: string;
  metadata: IRetrieverMetadata;
}

interface fetchRetreivalListDataProps {
  no: number;
  retriever_id: number;
  model_name: string;
  chunk_size: number;
  chunk_overlap: number;
  status: string;
  updated_at: string;
}

interface ChatPlay_SOCKET_DATA {
  title: string;
  content: {} | string;
  retriever?: IRetrieverSource[];
  [key: number]: any;
}

interface ConfigType {
  method: string;
  url: string;
  headers: HeaderType;
  params?: any;
  data?: string | FormData;
  timeout?: number;
}

interface ChatPlayUIProps {
  isHidden: boolean;
}

interface IChatPlayQuestionGuide {
  genQuestions: IChatPlayQuestions[];
}

interface ChatPlayUserChatProps {
  index: number;
  chatData: string | ChatPlayHistoryWithActionType;
  isMarginTop: boolean;
}

interface IEngineParameterChatPlay {
  label: string;
  // key: string;
  range: {
    from: number;
    to: number;
  };
  required: boolean;
  default_value: string;
  info: string;
  engInfo: string;
  value?: string;
}

interface EngineParameterInputProps {
  engineParams: Record<string, IEngineParameterChatPlay> | undefined;
  engineInfo: any;
  paramType: 'llm' | 'rag';
  setValue: (field: string, value: any) => void;
  control?: any;
  language: string;

  watch?: any;
  getValue?: any;
}

interface EngineParameterInputPropsViewModel {
  engineParams: Record<string, IEngineParameterChatPlay> | undefined;

  paramType: 'llm' | 'rag';
  setValue: (field: string, value: any) => void;

  watch?: any;
  getValue?: any;
}
interface ChatPlayNameSelectBoxProps {
  ref?: any;
  id?: string;
  name?: string;
  btnName?: string;
  control?: any;
  register?: any;
  borderValue?: string;
  placeholder?: string | null;
  boxClassName?: string;
  buttonClassName?: string;
  defaultValue?: string;
  currentLabel?: any;

  error?: boolean;
  reset?: boolean;
  style?: CSSProperties;
}

interface IRagEngineList {
  model_name: string;
  retriever_id: number;
  created_by_role: string;
}

interface LaborHistoryType {
  role: string;
  content: string;
  retriever?: LaborRetrieverSource[];
}

interface LaborHistoryInfo {
  history: LaborHistoryType[];
}

interface DownloadFileBtnProps {
  fileSummaryContent?: string;
  fileTitleContent?: string;
  fileContentContent?: string;
  name: string;
  disabled?: boolean;
}

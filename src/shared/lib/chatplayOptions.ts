export const CHATPLAY_RETRIEVAL_ENGINE = [
  { value: '1', label: 'OpenAI ChatGPT' },
  { value: '2', label: 'MaumAI MaumGPT' },
];

export const CHATPLAY_GPT_LLM_ENGINE = [
  { value: '8', label: 'gpt-4-turbo-preview' },
  { value: '9', label: 'gpt-4' },
  { value: '10', label: 'gpt-3.5-turbo-16k' },
  { value: '11', label: 'gpt-3.5-turbo-1106' },
  { value: '12', label: 'gpt-3.5-turbo' },
];

export const CHATPLAY_MAUM_LLM_ENGINE = [
  { value: '13', label: 'Polyglot 13B' },
  { value: '14', label: 'Llama2 13B' },
];

export const SOCKET_EVENT = {
  CHATBOT_REQUEST: 'llm_request',
  LOG_STREAM_START: 'llm_request_start',
  CHATBOT_RESPONSE: 'llm_response',
  LOG_STREAM_END: 'llm_response_end',
  GEN_QUESTIONS: 'llm_request_create_question',
  GET_QUESTIONS: 'create_question_end',
  CREATED_ROOM: 'created_room',
  DATA_EMBEDDED: 'data_embedded',
  RAG_REQUEST: 'rag_request',
  RAG_RESPONSE: 'rag_response_end',
  ERROR: 'error',
  ERROR_LLM_REQUEST: 'error_llm_request',
  ERROR_RETRIEVER_CREATE: 'error_retriever_create',
};

export const FILE_SIZE_MAX_LIMIT = 30 * 1024 * 1024; // 30MB

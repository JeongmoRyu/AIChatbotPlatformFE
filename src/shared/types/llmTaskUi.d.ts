interface optionProps {
  id: string;
  value: string;
  label: string;
  defaultChecked: boolean;
}

interface LlmEmailFormProps {
  type: string;
  purpose: string;
  style?: string;
  language: string;
  content?: string;
  customPurpose?: string;
  keyPoint?: string;
}
interface LlmEmailSendParamProps extends LlmEmailFormProps {
  type: string;
  content: string;
}

interface LlmreCreate {
  title: boolean;
  contents: boolean;
}

interface LlmConferenceFormProps {
  title: string;
  period?: string;
  participant: string;
  note?: string;
  agenda: string;
  modelNumber?: number;
  lang?: number;
}

interface LlmNewsProps {
  content: string;
  language: string;
  topic: string;
}

interface LlmPromotionProps {
  productName: string;
  productInfo: string;
  detailedService: string;
  companyName: string;
  keyword: string;
  target: string;
  modelNumber?: number;
  // lang?: number;
  language?: string;
}

interface LlmScriptContentProps {
  topic: string;
  content: string;
  language?: string;
}

interface LlmCoreSummaryProps {
  content: string;
  limit: boolean;
  limitNumber: string | number;

  modelNumber?: number;
  // lang?: number;
  language?: string;
}

interface LlmEditProps {
  content: string;
  language?: string;
}

interface LlmTranslateProps {
  language: string;
  content: string;
}

interface LlmAnalysisProps {
  content: string;
  details: string;
  language?: string;
}

interface LlmCodeProps {
  content: string;
  code_language: string;

  modelNumber?: number;
  // lang?: number;
  language?: string;
}

interface InputTextParagraphProps {
  helperText?: string | null;
  registerName: string;

  setContent?: React.Dispatch<React.SetStateAction<string>>;
  content?: string;
  numberContent?: number;
  bigName?: string;
  type?: string;
  placeholder?: string | null;
  point?: boolean;
  limitNum?: number;
  limitByte?: boolean;
  setValue?: any;
  disableBtn?: boolean;
}

interface ResultCardCoreProps {
  title: string;
  createdSentence: string;
  regenerateLoading?: boolean;
  onClickReCreate?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  nowGeneration?: boolean;
  disabled?: boolean;
  markdown?: boolean;
  preview?: boolean;
  regenerate?: boolean;
  height?: number;
}

interface ResultCardProps {
  createdSentence: string;
  preview?: boolean;
}

interface LlmViewModelProps {
  setValue: any;
}

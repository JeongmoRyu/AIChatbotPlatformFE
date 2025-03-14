interface LayoutProps {
  children: React.ReactNode;
}

interface ComponentProps {
  children: React.ReactNode;
}

type CardType = 'large' | 'middle' | 'small';

interface CardComponentProps {
  title: string;
  subTitle?: string;
  description: string;
  to?: string;
  type?: CardType;
  iconURL?: string;

  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

interface CardListProps {
  title?: string;
  list: CardComponentProps[];
  type?: CardType;
}

interface GoToProps {
  to: string;
}

interface MODAL_RETREIVAL_TYPE {
  isShow: boolean;
  id?: number;
  name: string;
}

interface ILLMModel {
  id: string;
  name: string;
  category: 'maum' | 'third-party';
  categoryLabel: '기본 모델' | '외부 모델';
}

interface ISampleQuestion {
  title: string;
  question: string;
}

interface ISampleQuestionGroup {
  type: 'single' | 'multi';
  count?: number;
  questions: ISampleQuestion[];
}

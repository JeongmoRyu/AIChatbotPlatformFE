interface LayoutProps {
  children: React.ReactNode;
}

interface ComponentProps {
  children: React.ReactNode;
}

type CardType = 'large' | 'small';

interface CardComponentProps {
  title: string;
  subTitle?: string;
  description: string;
  to?: string;
  type?: CardType;
}

interface CardListProps {
  title?: string;
  list: CardComponentProps[];
  type?: CardType;
}

interface GoToProps {
  to: string;
}

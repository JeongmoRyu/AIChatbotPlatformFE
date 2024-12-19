import FeatureCardView from '@/features/card/view/FeatureCardView';

import useFeatureCardListViewLLMViewModel from '../ViewModel/useFeatureCardListViewLLMViewModel';

// FeatureCardListViewProps는 CardListProps에 listClassName, containerClassName을 추가한 타입입니다.
interface FeatureCardListViewLLMProps extends CardListProps {
  listClassName?: string;
  containerClassName?: string;
  llm?: string;
}

const FeatureCardListViewLLM = ({
  list,
  type,

  listClassName,
  containerClassName = '',
}: FeatureCardListViewLLMProps) => {
  if (!list || list.length === 0) return null;

  const viewModel = useFeatureCardListViewLLMViewModel();

  if (!viewModel) return null;

  const { handleClickMenu } = viewModel;

  return (
    <div className={containerClassName}>
      <div className={listClassName}>
        {list.map((cardData, index) => {
          console.log(cardData);
          return (
            <FeatureCardView
              key={index}
              {...cardData}
              type={type}
              iconURL={cardData.iconURL}
              redirect={cardData.redirect}
              onClick={handleClickMenu}
            />
          );
        })}
      </div>
    </div>
  );
};

export default FeatureCardListViewLLM;

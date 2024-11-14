import FeatureCardView from '@/features/card/view/FeatureCardView';

// FeatureCardListViewProps는 CardListProps에 listClassName, containerClassName을 추가한 타입입니다.
interface FeatureCardListViewProps extends CardListProps {
  listClassName?: string;
  containerClassName?: string;
}

const FeatureCardListView = ({
  list,
  type,
  title,
  listClassName,
  containerClassName = '',
}: FeatureCardListViewProps) => {
  if (!list || list.length === 0) return null;

  return (
    <div className={containerClassName}>
      {title && <h4 className="text-xlBold">{title}</h4>}
      <div className={listClassName}>
        {list.map((cardData, index) => (
          <FeatureCardView key={index} {...cardData} type={type} />
        ))}
      </div>
    </div>
  );
};

export default FeatureCardListView;

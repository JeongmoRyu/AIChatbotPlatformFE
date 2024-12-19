import { useTranslation } from 'react-i18next';

interface ListAreaProps {
  count: number;
  btnBox?: any;
  listCont: JSX.Element;
  deleteBtn?: boolean;
}

function ListArea({ count, btnBox, listCont, deleteBtn = true }: ListAreaProps) {
  const { t } = useTranslation(['common']);

  return (
    <>
      <div className={btnBox ? 'result-stats flex justify-between items-center' : 'result-stats'}>
        <div>
          <span className="text-primary-dark">{count}</span> {t('common:건의_검색결과가_있어요')}
        </div>
        {deleteBtn && btnBox && count > 0 && btnBox}
      </div>
      <div className="mt-5 result-wrap">{listCont}</div>
    </>
  );
}

export default ListArea;

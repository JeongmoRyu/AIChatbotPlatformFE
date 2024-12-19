import icoInfo from '@/shared/assets/images/icons/ico_info.svg';

interface ResultNotFoundProps {
  firstContent: string;
  secondContent?: string;
}

function ResultNotFound({ firstContent, secondContent }: ResultNotFoundProps) {
  return (
    <div className="mt-5 result-notfound">
      <div className="notfound-img">
        <img src={icoInfo} alt="검색결과 없음" />
      </div>
      <p>
        {firstContent}
        <br />
        {secondContent && secondContent}
      </p>
    </div>
  );
}

export default ResultNotFound;

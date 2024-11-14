import { useNavigate } from 'react-router-dom';

const PageEmbeddingRanker = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Embedding Ranker</h2>
      <button type="button" onClick={() => navigate('/embedding-leaderboard')}>
        생성하기
      </button>
    </div>
  );
};

export default PageEmbeddingRanker;

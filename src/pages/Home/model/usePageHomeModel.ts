import BgMainTop from '@/shared/assets/images/bg-main-top.svg';
import LogoSVG from '@/shared/assets/images/homeHeaderTitle.svg';
import { useEffect, useState } from 'react';

interface HeaderDataItem {
  subTitle: string;
  title: string;
  titleImage: typeof LogoSVG;
  backgroundImage?: typeof LogoSVG;
}

interface HomeData {
  headerData: HeaderDataItem;
  solutionData: CardListProps;
  templateData: CardListProps;
}

const useHomeModel = () => {
  const [headerData, setHeaderData] = useState<HomeData['headerData'] | null>(null);
  const [solutionData, setSolutionData] = useState<HomeData['solutionData'] | null>(null);
  const [templateData, setTemplateData] = useState<HomeData['templateData'] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchHomeData();
      setHeaderData(data.headerData || null);
      setSolutionData(data.solutionData || null);
      setTemplateData(data.templateData || null);
    };

    fetchData();
  }, []);

  return { headerData, solutionData, templateData };
};

export default useHomeModel;

const fetchHeaderData = async (): Promise<HomeData['headerData']> => {
  const headerData = {
    subTitle: 'On-premise LLM 플랫폼',
    titleImage: LogoSVG,
    title: 'MAUM.AI의 LLM 솔루션',
    backgroundImage: BgMainTop,
  };

  return headerData;
};

const fetchSolutionsData = async () => {
  const solutionData: CardListProps = {
    list: [
      {
        title: 'AI와의 대화',
        description: '다양한 LLM 모델과 대화해보세요.',
        to: '/ai-chat',
      },
      {
        title: '챗플레이',
        subTitle: 'Chat Play',
        description: '쉽고 빠르게 문서를 모델에 학습시키고 해당 문서에 대한 대화를 나눌 수 있습니다.',
        to: '/chat-play',
      },
      {
        title: '챗허브',
        subTitle: 'Chat Hub',
        description: 'Input 데이터와 Output 설정을 조정하여 정교한 커스텀챗봇을 만들 수 있습니다.',
        to: '/chat-hub',
      },
      {
        title: 'Embedding Ranker',
        description: '한번에 여러가지 LLM  모델 성능을 시험하고 정답률을 비교할 수 있습니다.',
        to: '/embedding-ranker',
      },
    ],
    type: 'large',
  };
  return solutionData;
};

const fetchTemplateData = async () => {
  const templateData: CardListProps = {
    title: '다양한 예제 템플릿을 자유롭게 활용해보세요',
    list: [
      {
        title: '이메일 작성',
        description: '발신 목적과 핵심 내용을 입력하면 완성된 이메일을 작성해드립니다.',
      },
      {
        title: '뉴스 기사 작성',
        description: '홍보 주제, 언어, 포함할 내용을 입력하면 보도자료나 뉴스 기사를 작성해드립니다.',
      },
      {
        title: '홍보 문구 작성',
        description: '제품 정보, 홍보 키워드 등을 입력하면 홍보 문구를 작성해드립니다.',
      },
      {
        title: '영상 스크립트 작성',
        description: '영상 주제와 포함할 내용을 입력하면 영상 스크립트를 작성해드립니다.',
      },
      {
        title: '문서 핵심 요약',
        description: '문서 전체를 복사하여 붙여넣어주세요. 핵심 내용을 요약해드립니다.',
      },
      {
        title: '문서 핵심 요약',
        description: '문서 내용을 입력하면 오타 수정을 포함한 문서 첨삭을 해드립니다.',
      },
      {
        title: '한-영 번역',
        description: '한국어 텍스트를 입력하면 영문으로 번역해드립니다.',
      },
      {
        title: '문서 분석',
        description: '문서를 입력하고 분석 방향을 제시하면 분석한 내용을 제공합니다.',
      },
      {
        title: '코드 작성',
        description: '프로그래밍 언어를 선택하고 코딩 목적을 입력하면 코드를 작성해드립니다.',
      },
    ],
    type: 'small',
  };

  return templateData;
};

const fetchHomeData = async (): Promise<HomeData> => {
  const headerData = await fetchHeaderData();
  const solutionData = await fetchSolutionsData();
  const templateData = await fetchTemplateData();

  const data = { headerData, solutionData, templateData };
  return data;
};

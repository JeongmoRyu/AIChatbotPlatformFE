import BgMainTop from '@/shared/assets/images/bg-main-top.svg';
import LogoSVGKO from '@/shared/assets/images/homeHeaderTitleKO.svg';
import LogoSVGEN from '@/shared/assets/images/homeHeaderTitleEN.svg';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import email from '@/shared/assets/images/image/llm/Icon-llm-email.svg';
import news from '@/shared/assets/images/image/llm/Icon-llm-news.svg';
import promotion from '@/shared/assets/images/image/llm/Icon-llm-promotion.svg';
import script from '@/shared/assets/images/image/llm/Icon-llm-script.svg';
import summary from '@/shared/assets/images/image/llm/Icon-llm-summary.svg';
import edit from '@/shared/assets/images/image/llm/Icon-llm-edit.svg';
import translate from '@/shared/assets/images/image/llm/Icon-llm-translate.svg';
import analysis from '@/shared/assets/images/image/llm/Icon-llm-analysis.svg';
import code from '@/shared/assets/images/image/llm/Icon-llm-code.svg';
import {
  LLM_TASK_ANALYSIS_DOC_PATH,
  LLM_TASK_CODE_PATH,
  LLM_TASK_CORE_SUMMARY_PATH,
  LLM_TASK_DOCUMENT_PATH,
  LLM_TASK_EMAIL_PATH,
  LLM_TASK_NEWS_PATH,
  LLM_TASK_PROMOTION_PATH,
  LLM_TASK_SCRIPT_PATH,
  LLM_TASK_TRANSLATE_PATH,
} from '@/shared/lib/urlPath';
import { userAuthority as useUserAuthority } from '@/shared/store/onpromise';
import { useRecoilValue } from 'recoil';
interface HeaderDataItem {
  subTitle: string;
  title: string;
  titleImage: typeof LogoSVGKO;
  backgroundImage?: typeof LogoSVGKO;
}

interface HomeData {
  headerData: HeaderDataItem;
  solutionData: CardListProps;
  templateData: CardListProps;
}

const useHomeModel = () => {
  const { i18n } = useTranslation(['']);

  const [headerData, setHeaderData] = useState<HomeData['headerData'] | null>(null);
  const [solutionData, setSolutionData] = useState<HomeData['solutionData'] | null>(null);
  const [templateData, setTemplateData] = useState<HomeData['templateData'] | null>(null);
  const userAuthority = useRecoilValue(useUserAuthority);

  useEffect(() => {
    const fetchData = async () => {
      const header = await fetchHeaderData(i18n.language);
      const solution = await fetchSolutionsData();
      const template = await fetchTemplateData();

      const adjustedSolution =
        userAuthority === ''
          ? { ...solution, list: solution.list.filter((item) => item.title !== 'Embedding Ranker') }
          : solution;
      setHeaderData(header);
      setSolutionData(adjustedSolution);
      setTemplateData(template);
    };

    fetchData();
  }, [i18n.language, userAuthority]);

  return { headerData, solutionData, templateData };
};

export default useHomeModel;

const fetchHeaderData = async (language: string): Promise<HomeData['headerData']> => {
  const headerData = {
    subTitle: 'menu:On_premise_LLM_플랫폼',
    titleImage: language === 'ko' ? LogoSVGKO : LogoSVGEN,
    title: 'menu:MAUM_AI의_LLM_솔루션',
    backgroundImage: BgMainTop,
  };

  return headerData;
};

const fetchSolutionsData = async () => {
  const solutionData: CardListProps = {
    list: [
      {
        title: 'menu:AI와의_대화',
        description: 'menu:다양한_LLM_모델과_대화해보세요',
        to: '/ai-chat',
      },
      {
        title: 'menu:챗플레이',
        subTitle: 'Chat Play',
        description: 'menu:쉽고_빠르게_문서를_모델에_학습시키고_해당_문서에_대한_대화를_나눌_수_있습니다',
        to: '/chat-play',
      },
      {
        title: 'menu:챗허브',
        subTitle: 'Chat Hub',
        description: 'menu:Input_데이터와_Output_설정을_조정하여_정교한_커스텀챗봇을_만들_수_있습니다',
        to: '/chat-hub',
      },
      {
        title: 'Embedding Ranker',
        description: 'menu:한번에_여러가지_LLM_모델_성능을_시험하고_정답률을_비교할_수_있습니다',
        to: '/embedding-history',
      },
    ],
    type: 'large',
  };
  return solutionData;
};

const fetchTemplateData = async () => {
  const templateData: CardListProps = {
    title: 'llm:다양한_예제_템플릿을_자유롭게_활용해보세요',
    list: [
      {
        title: 'llm:이메일_작성',
        description: 'llm:발신_목적과_핵심_내용을_입력하면_완성된_이메일을_작성해드립니다',
        iconURL: email,
        redirect: LLM_TASK_EMAIL_PATH,
      },
      {
        title: 'llm:뉴스_기사_작성',
        description: 'llm:홍보_주제_언어_포함할_내용을_입력하면_보도자료나_뉴스_기사를_작성해드립니다',
        iconURL: news,
        redirect: LLM_TASK_NEWS_PATH,
      },
      {
        title: 'llm:홍보_문구_작성',
        description: 'llm:제품_정보_홍보_키워드_등을_입력하면_홍보_문구를_작성해드립니다',
        iconURL: promotion,
        redirect: LLM_TASK_PROMOTION_PATH,
      },
      {
        title: 'llm:영상_스크립트_작성',
        description: 'llm:영상_주제와_포함할_내용을_입력하면_영상_스크립트를_작성해드립니다',
        iconURL: script,
        redirect: LLM_TASK_SCRIPT_PATH,
      },
      {
        title: 'llm:문서_핵심_요약',
        description: 'llm:문서_전체를_복사하여_붙여넣어주세요_핵심_내용을_요약해드립니다',
        iconURL: summary,
        redirect: LLM_TASK_CORE_SUMMARY_PATH,
      },
      {
        title: 'llm:문서_첨삭',
        description: 'llm:문서_내용을_입력하면_교정_교열을_포함한_문서_첨삭을_해드립니다',
        iconURL: edit,
        redirect: LLM_TASK_DOCUMENT_PATH,
      },
      {
        title: 'llm:한_영_번역',
        description: 'llm:한국어_텍스트를_입력하면_영문으로_번역해드립니다',
        iconURL: translate,
        redirect: LLM_TASK_TRANSLATE_PATH,
      },
      {
        title: 'llm:문서_분석',
        description: 'llm:문서를_입력하고_분석_방향을_제시하면_분석한_내용을_제공합니다',
        iconURL: analysis,
        redirect: LLM_TASK_ANALYSIS_DOC_PATH,
      },
      {
        title: 'llm:코드_작성',
        description: 'llm:프로그래밍_언어를_선택하고_코딩_목적을_입력하면_코드를_작성해드립니다',
        iconURL: code,
        redirect: LLM_TASK_CODE_PATH,
      },
    ],
    type: 'small',
  };

  return templateData;
};

// const fetchHomeData = async (): Promise<HomeData> => {
//   const headerData = await fetchHeaderData();
//   const solutionData = await fetchSolutionsData();
//   const templateData = await fetchTemplateData();

//   const data = { headerData, solutionData, templateData };
//   return data;
// };

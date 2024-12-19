import firstPic from '@/shared/assets/images/image/chatplay/guide_1.png';
import SecondPic from '@/shared/assets/images/image/chatplay/guide_2.png';
import ArrowPicBig from '@/shared/assets/images/image/chatplay/ico_arrow@2x.svg';
import { useTranslation } from 'react-i18next';

interface IGuideSection {
  imgSrc: string;
  altText: string;
  titleKey: string;
  descriptionKey: string;
}

function GuideSection({ imgSrc, altText, titleKey, descriptionKey }: IGuideSection) {
  const { t } = useTranslation(['chatplay']);

  return (
    <div className="inline-block max-w-full p-5">
      <img src={imgSrc} alt={altText} className="max-w-full max-h-full mx-auto" />
      <div className="h-2.5 p-2.5"></div>
      <div className="max-w-[60%] m-auto text-center">
        <div className="text-xl font-bold">{t(titleKey)}</div>
        <div className="h-2.5 p-2.5"></div>
        <div className="text-gray">{t(descriptionKey)}</div>
      </div>
    </div>
  );
}

export default function ChatPlayGuide() {
  const { t, i18n } = useTranslation(['chatplay']);

  return (
    <div className="max-w-[90%] xl:max-w-[55rem] mx-auto mb-20 tablet:mb-8">
      <div className="h-24 p-2.5"></div>
      <div className="flex items-center justify-center pl-12 mb-16">
        <div className="flex flex-col items-center justify-center">
          <p>{t('chatplay:문서와의_대화를_체험할_수_있습니다')}</p>
          <h3 className="text-[#111111] text-2xl font-bold">
            <span className={`text-primary-dark ${i18n.language === 'en' ? 'mr-2' : ''}`}>ChatPlay</span>
            {t('chatplay:하세요')}
          </h3>
        </div>
      </div>

      <div className="flex justify-center">
        <GuideSection
          imgSrc={firstPic}
          altText="Left Image"
          titleKey="챗봇_설정"
          descriptionKey="챗봇과_대화를_나눌_문서를_등록하고_설정_값을_확인합니다"
        />

        <div className="p-12">
          <img src={ArrowPicBig} alt="ARROW" className="w-12 h-12" />
        </div>

        <GuideSection
          imgSrc={SecondPic}
          altText="Right Image"
          titleKey="챗봇_테스트"
          descriptionKey="챗봇에게_질문하고_생성된_답변_로그를_확인하여_성능을_테스트합니다"
        />
      </div>
    </div>
  );
}

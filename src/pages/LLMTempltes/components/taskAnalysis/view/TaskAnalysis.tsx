import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

import ExampleBtn from '../../exampleBtn/view/ExampleBtn';
import InputTextParagraph from '../../InputTextParagraph/view/InputTextParagraph';
import GeneralButton from '@/shared/components/GeneralButton/view/GeneralButton';
import ResultCard from '../../resultCard/view/ResultCard';
import DownloadFileBtn from '../../downloadFileBtn/view/DownloadFileBtn';

import { LLM_TASK_EXAMPLE, LLM_TASK_EXAMPLE_ENG } from '@/shared/lib/llmTaskUi';

import useTaskAnalysisViewModel from '../viewModel/useTaskAnalysisViewModel';

const AnalysisDocument = () => {
  const { t, i18n } = useTranslation(['llm', 'common']);

  const defaultParams = {
    content: '',
    details: '',
    language: i18n.resolvedLanguage === 'ko' ? '한국어' : 'English',
  };

  const DataSchema = yup.object().shape({
    content: yup.string().required(),
    details: yup.string().required(),
  });

  const methods = useForm<LlmAnalysisProps>({
    mode: 'onSubmit',
    resolver: yupResolver(DataSchema),
    defaultValues: defaultParams,
  });

  const {
    setValue,
    handleSubmit,
    formState: {},
  } = methods;

  const {
    handleClickReCreate,
    handleClickEx,
    isNewCreating,
    createdContents,
    isReCreate,
    disableBtn,
    details,
    setDetails,
    content,
    setContent,
    onSubmit,
  } = useTaskAnalysisViewModel({ setValue });

  const SAMPLE = i18n.resolvedLanguage === 'ko' ? LLM_TASK_EXAMPLE : LLM_TASK_EXAMPLE_ENG;

  return (
    <div className="contents ai-service max-w-[1920px] p-16 desktop-sm:max-w-[880px] laptop:mt-16 ">
      <div className="flex flex-row items-center">
        <p className="text-xl font-bold">{t('llm:문서_분석')}</p>
      </div>
      <p className="py-6 border-b text-primary-gray border-set-border">
        {t('llm:분석을_원하는_문서의_내용을_입력하고_분석_상세_요청_내용을_입력하세요')}
      </p>
      <div className="flex flex-row items-center w-full mt-8">
        <div className="mr-4 w-30">
          <p className="text-base font-medium text-secondary-default">{t('llm:빠른_생성')}</p>
        </div>
        <ul className="flex flex-wrap">
          {SAMPLE.analysis.map((_, i) => {
            return (
              <li className=" align-center" key={i}>
                <ExampleBtn title={`Sample ${i + 1}`} onClick={() => handleClickEx(i)} disabled={disableBtn} />
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mt-8 wf-form ">
        <div className="flex flex-row w-full gap-20 mt-6 laptop:flex-col ">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="w-1/2 p-10 bg-white rounded-xl desktop-sm:w-full">
              <ul>
                <li>
                  <InputTextParagraph
                    helperText={t('llm:문서_내용을_입력하세요') as string}
                    registerName={'content'}
                    setContent={setContent}
                    content={content}
                    bigName={t('llm:문서_내용')}
                    type={'textarea'}
                    point={true}
                    limitNum={6000}
                    disableBtn={disableBtn}
                  />
                </li>
                <li className="mt-10">
                  <InputTextParagraph
                    helperText={t('llm:분석_상세_요청_내용을_입력하세요') as string}
                    registerName={'details'}
                    setContent={setDetails}
                    content={details}
                    bigName={t('llm:분석_상세_요청_내용')}
                    type={'textarea'}
                    point={true}
                    limitNum={1000}
                    disableBtn={disableBtn}
                  />
                </li>

                <li className="flex justify-end mt-8">
                  <GeneralButton
                    type="submit"
                    name="save"
                    className={`flex items-center btn primary save ${disableBtn ? 'hover:cursor-not-allowed' : 'hover:cursor-pointer'} hover:bg-blue-700 `}
                  >
                    {isNewCreating ? t('llm:생성중') : t('llm:생성_하기')}
                  </GeneralButton>
                </li>
              </ul>
            </form>
          </FormProvider>

          <form className="flex flex-col w-1/2 p-10 bg-white rounded-xl desktop-sm:w-full">
            <ResultCard
              title={t('llm:분석_내용')}
              createdSentence={createdContents}
              regenerateLoading={isReCreate}
              onClickReCreate={handleClickReCreate}
              nowGeneration={isNewCreating}
              disabled={disableBtn}
              height={24.3}
            />

            <div className="flex justify-end mt-8">
              <DownloadFileBtn fileContentContent={createdContents} name="analysis" disabled={disableBtn} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDocument;

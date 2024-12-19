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

import useTaskSummaryViewModel from '../viewModel/useTaskSummaryViewModel';

const TaskSummary = () => {
  const { t, i18n } = useTranslation(['llm', 'common']);

  const defaultParams = {
    content: '',
    limitNumber: '',
    limit: true,
    modelNumber: 3,
    language: i18n.resolvedLanguage === 'ko' ? '한국어' : 'English',
  };

  const SAMPLE = i18n.resolvedLanguage === 'ko' ? LLM_TASK_EXAMPLE : LLM_TASK_EXAMPLE_ENG;

  const DataSchema = yup.object().shape({
    content: yup.string().required(),
    limit: yup.boolean().required(),
    limitNumber: yup.mixed<string | number>().required(),
    modelNumber: yup.number().optional(),
    language: yup.string().optional(),
  });

  const methods = useForm<yup.InferType<typeof DataSchema>>({
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
    handleClickReCreateContents,
    handleClickEx,
    onSubmit,
    setContent,
    content,
    isNewCreating,
    createdContents,
    isReCreate,
    disableBtn,
  } = useTaskSummaryViewModel({ setValue });

  return (
    <div className="contents ai-service max-w-[1920px] p-16 desktop-sm:max-w-[880px] laptop:mt-16 ">
      <div className="flex flex-row items-center">
        <p className="text-xl font-bold">{t('llm:문서_핵심_요약')}</p>
      </div>
      <p className="py-6 border-b text-primary-gray border-set-border">{t('llm:요약을_원하는_내용을_입력해주세요')}</p>
      <div className="flex flex-row items-center w-full mt-8">
        <div className="mr-4 w-30">
          <p className="text-base font-medium text-secondary-default ">{t('llm:빠른_생성')}</p>
        </div>
        <ul className="flex flex-wrap">
          {SAMPLE.core_summary.map((_, i) => {
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
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-1/2 p-10 bg-white wf-form rounded-xl desktop-sm:w-full "
            >
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
                    limitNum={7000}
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
              title={t('llm:문서_요약_내용')}
              createdSentence={createdContents}
              onClickReCreate={handleClickReCreateContents}
              regenerateLoading={isReCreate}
              nowGeneration={isNewCreating}
              disabled={disableBtn}
              height={9.8}
            />

            <div className="flex justify-end mt-8 ">
              <DownloadFileBtn fileContentContent={createdContents} name="summary" disabled={disableBtn} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskSummary;

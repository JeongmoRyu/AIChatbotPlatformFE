import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

import ExampleBtn from '../../exampleBtn/view/ExampleBtn';
import Select from '@/shared/components/Select/view/Select';
import InputTextParagraph from '../../InputTextParagraph/view/InputTextParagraph';
import GeneralButton from '@/shared/components/GeneralButton/view/GeneralButton';
import ResultCard from '../../resultCard/view/ResultCard';
import DownloadFileBtn from '../../downloadFileBtn/view/DownloadFileBtn';

import { CODE_LANGUAGES_CHANGES, LLM_TASK_EXAMPLE, LLM_TASK_EXAMPLE_ENG } from '@/shared/lib/llmTaskUi';

import useTaskCodeViewModel from '../viewModel/useTaskCodeViewModel';

const WritingCode = () => {
  const { t, i18n } = useTranslation(['llm', 'common']);

  const defaultValue = {
    content: '',
    code_language: CODE_LANGUAGES_CHANGES[0].value,
    modelNumber: 3,
    language: i18n.resolvedLanguage === 'ko' ? '한국어' : 'English',
  };

  const SAMPLE = i18n.resolvedLanguage === 'ko' ? LLM_TASK_EXAMPLE : LLM_TASK_EXAMPLE_ENG;

  const DataSchema = yup.object().shape({
    code_language: yup.string().required(),
    content: yup.string().required(),
  });

  const methods = useForm<LlmCodeProps>({
    mode: 'onSubmit',
    resolver: yupResolver(DataSchema),
    defaultValues: defaultValue,
  });

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;

  const {
    handleClickReCreate,
    onSubmit,
    handleClickEx,
    translatedTypeList,
    selectedLanguage,
    setContent,
    content,
    createdContents,
    isReCreate,
    isNewCreating,
    disableBtn,
  } = useTaskCodeViewModel({ setValue });

  return (
    <div className="contents ai-service max-w-[1920px] p-16 desktop-sm:max-w-[880px] laptop:mt-16 ">
      <div className="flex flex-row items-center">
        <p className="text-xl font-bold">{t('llm:코드_작성')}</p>
      </div>
      <p className="py-6 border-b text-primary-gray border-set-border">
        {t('llm:작성하고자_하는_언어를_선택하여_원하는_코드의_내용을_입력하세요')}
      </p>
      <div className="flex flex-row items-center w-full mt-8">
        <div className="mr-4 w-30">
          <p className="text-base font-medium text-secondary-default ">{t('llm:빠른_생성')}</p>
        </div>
        <ul className="flex flex-wrap">
          {SAMPLE.code.map((_, i) => {
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
                  <p className="mb-4 marketing-title">
                    {t('llm:언어')}
                    <span className="ml-1 text-red-500 ">*</span>
                  </p>
                  <Select
                    key={selectedLanguage}
                    register={{ ...register('code_language') }}
                    id="code_language"
                    typeList={translatedTypeList}
                    defaultLabel={selectedLanguage}
                    boxClassName="w-full"
                    onClick={(e) => setValue('code_language', e.currentTarget.dataset.value as string)}
                    error={errors.hasOwnProperty('code_language') ? true : false}
                    disabled={disableBtn}
                  />
                </li>
                <li className="mt-4">
                  <InputTextParagraph
                    helperText={t('llm:내용을_작성해_주세요') as string}
                    registerName={'content'}
                    setContent={setContent}
                    content={content}
                    bigName={t('llm:작성_내용')}
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
                    disabled={disableBtn}
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
              title={t('llm:코드_결과물')}
              createdSentence={createdContents}
              onClickReCreate={handleClickReCreate}
              regenerateLoading={isReCreate}
              nowGeneration={isNewCreating}
              disabled={disableBtn}
              markdown={true}
              height={17.4}
            />

            <div className="flex justify-end mt-8">
              <DownloadFileBtn fileContentContent={createdContents} name="code" disabled={disableBtn} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WritingCode;

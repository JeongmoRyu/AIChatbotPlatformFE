import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

import DownloadFileBtn from '../../downloadFileBtn/view/DownloadFileBtn';
import ResultCard from '../../resultCard/view/ResultCard';
import GeneralButton from '@/shared/components/GeneralButton/view/GeneralButton';
import ExampleBtn from '../../exampleBtn/view/ExampleBtn';
import InputTextParagraph from '../../InputTextParagraph/view/InputTextParagraph';
import Input from '@/shared/components/Input/view/Input';
import Radio from '@/shared/components/Radio/view/Radio';

import {
  CREATE_CONFIG_70B,
  LLM_TASK_EMAIL_SEND_RADIO_PURPOSE_01,
  LLM_TASK_EMAIL_SEND_RADIO_PURPOSE_02,
  LLM_TASK_EXAMPLE,
  LLM_TASK_EXAMPLE_ENG,
} from '@/shared/lib/llmTaskUi';
import useTaskEmailViewModel from '../viewModel/useTaskEmailViewModel';

function TaskEmail() {
  const { t, i18n } = useTranslation(['llm', 'common']);

  const defaultParams = {
    type: '발신',
    purpose: '',
    style: '.',
    language: i18n.language === 'ko' ? '한국어' : 'English',
    content: '',
    config: CREATE_CONFIG_70B,
  };

  const SAMPLE = i18n.resolvedLanguage === 'ko' ? LLM_TASK_EXAMPLE : LLM_TASK_EXAMPLE_ENG;

  const DataSchema = yup.object().shape({
    type: yup.string().required(),
    purpose: yup.string().required(),
    style: yup.string().optional(),
    language: yup.string().required(),
    content: yup.string().required(),
    customPurpose: yup.string().optional(),
    keyPoint: yup.string().optional(),
  });

  const methods = useForm<LlmEmailSendParamProps>({
    mode: 'onSubmit',
    resolver: yupResolver(DataSchema),
    defaultValues: defaultParams,
  });

  const {
    register,
    setValue,
    handleSubmit,
    formState: {},
  } = methods;

  const {
    handleClickEx,
    handleClickReCreateContents,
    handleOnChangePurpose,
    onSubmit,
    setPurpose,
    purpose,
    setCustomPurpose,
    customPurpose,
    setContentInput,
    contentInput,
    isNewCreating,
    createdContent,
    isReCreate,
    disableBtn,
  } = useTaskEmailViewModel({
    setValue,
  });

  return (
    <div className="contents ai-service max-w-[1920px] p-16 desktop-sm:max-w-[880px] laptop:mt-16 ">
      <div className="flex flex-row items-center">
        <p className="text-xl font-bold"> {t('llm:이메일_작성')}</p>
      </div>
      <div className="py-6 border-b border-set-border">
        <p className="text-primary-gray">{t('llm:원하는_이메일_작성_유형을_선택하고_핵심_내용을_입력해주세요')}</p>
      </div>
      <div className="flex flex-row items-center w-full mt-8">
        <div className="mr-4 w-30">
          <p className="text-base font-medium text-secondary-default">{t('llm:빠른_생성')}</p>
        </div>
        <ul className="flex flex-wrap">
          {SAMPLE.email.SEND.map((_, i) => (
            <li className="" key={i}>
              <ExampleBtn title={`Sample ${i + 1}`} onClick={() => handleClickEx(i)} disabled={disableBtn} />
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8 wf-form ">
        <div className="flex flex-row w-full gap-20 mt-6 laptop:flex-col ">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="w-1/2 p-10 bg-white rounded-xl desktop-sm:w-full ">
              <ul className="flex flex-col">
                <li>
                  <p className="marketing-title ">
                    {t('llm:발신_목적')}
                    <span className="ml-1 text-red-500 ">*</span>
                  </p>

                  <div className="flex flex-col items-start mt-4 ">
                    <div className="flex flex-row justify-start mobile:flex-col mobile:items-start">
                      {LLM_TASK_EMAIL_SEND_RADIO_PURPOSE_01 &&
                        LLM_TASK_EMAIL_SEND_RADIO_PURPOSE_01.map((option) => {
                          return (
                            <Radio
                              key={option.id}
                              register={{ ...register('purpose') }}
                              name="purpose"
                              defaultChecked={option.defaultChecked}
                              id={option.id}
                              labelClassName="!bg-box-default"
                              value={t(option.value) as string}
                              label={t(option.label) as string}
                              labelNoSpace={true}
                              onChange={handleOnChangePurpose(option)}
                              disabled={disableBtn}
                            />
                          );
                        })}
                    </div>

                    <div className="flex flex-row mt-4">
                      <div className="flex flex-row mobile:flex-col mobile:-mt-4">
                        {LLM_TASK_EMAIL_SEND_RADIO_PURPOSE_02 &&
                          LLM_TASK_EMAIL_SEND_RADIO_PURPOSE_02.map((option) => {
                            return (
                              <Radio
                                register={{ ...register('purpose') }}
                                key={option.id}
                                id={option.id}
                                name="purpose"
                                labelClassName="!bg-box-default"
                                value={t(option.value) as string}
                                label={t(option.label) as string}
                                labelNoSpace={true}
                                onChange={handleOnChangePurpose(option)}
                                disabled={disableBtn}
                              />
                            );
                          })}
                      </div>
                    </div>

                    <div className="flex flex-row w-full mt-2">
                      <div className="flex items-center w-full">
                        <Radio
                          register={{ ...register('purpose') }}
                          name="purpose"
                          id="customPurpose"
                          labelClassName="!bg-box-default -ml-4"
                          value="customPurpose"
                          label=" "
                          labelNoSpace={true}
                          onChange={() => {
                            setPurpose('customPurpose');
                          }}
                          disabled={disableBtn}
                        />

                        <label
                          htmlFor="customPurpose"
                          className={`w-full !bg-transparent flex items-center  ${
                            purpose === 'customPurpose' ? 'text-black ' : 'text-gray-400'
                          }`}
                          key="기타"
                        >
                          <Input
                            name="purpose"
                            id="customPurpose"
                            placeholder={t('llm:직접입력') as string}
                            className="mt-1 "
                            onChange={(e) => {
                              setCustomPurpose(e.target.value);
                            }}
                            value={customPurpose}
                            disabled={purpose !== 'customPurpose'}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </li>

                <li className="mt-4">
                  <InputTextParagraph
                    helperText={t('llm:메일에_담고_싶은_핵심_내용을_입력하세요')}
                    registerName={'content'}
                    setContent={setContentInput}
                    content={contentInput}
                    bigName={t('llm:핵심_내용')}
                    type={'textarea'}
                    point={true}
                    limitNum={7000}
                    disableBtn={disableBtn}
                  />
                </li>

                <li className="mt-6">
                  <div className="flex justify-end ">
                    <GeneralButton
                      type="submit"
                      name="save"
                      className={`flex items-center btn primary save ${disableBtn ? 'hover:cursor-not-allowed' : 'hover:cursor-pointer'} hover:bg-blue-700 `}
                    >
                      {isNewCreating ? t('llm:생성중') : t('llm:생성_하기')}
                    </GeneralButton>
                  </div>
                </li>
              </ul>
            </form>
          </FormProvider>

          <form className="flex flex-col w-1/2 p-10 bg-white rounded-xl desktop-sm:w-full">
            <ResultCard
              title={t('llm:발신_내용')}
              createdSentence={createdContent}
              regenerateLoading={isReCreate}
              onClickReCreate={handleClickReCreateContents}
              nowGeneration={isNewCreating}
              disabled={disableBtn}
            />

            <div className="flex justify-end mt-8 ">
              <DownloadFileBtn fileContentContent={createdContent} name="emailSend" disabled={disableBtn} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TaskEmail;

import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import ico_delete_16 from '@/shared/assets/images/image/llm/ico_delete_16.svg';
import Input from '@/shared/components/Input/view/Input';
import Textarea from '@/shared/components/Textarea/view/Textarea';
import GeneralButton from '@/shared/components/GeneralButton/view/GeneralButton';
import HelperText from '@/shared/components/helperText/view/HelperText';

import useInputTextParagraphViewModel from '../viewModel/useInputTextParagraphViewModel';

const InputTextParagraph = ({
  helperText,
  registerName,

  setContent,
  content,
  bigName,
  type,
  placeholder,
  point,
  limitNum,
  limitByte,
  disableBtn,
}: InputTextParagraphProps) => {
  const { t } = useTranslation(['llm']);

  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  const { onClickClearContent, handleOnchangeInput, handleOnchangeTextarea, byte, length } =
    useInputTextParagraphViewModel({
      content,
      limitNum,
      setContent,
      setValue,
      registerName,
    });

  return (
    <div className="relative">
      <div className="flex flex-row items-end justify-between mb-2 ">
        <div className="flex flex-row items-end wf-form">
          <p className=" marketing-title">
            {bigName}
            {point && <span className="ml-1 text-red-500 ">*</span>}
          </p>
          {!limitByte && (
            <div className="flex justify-start ml-4">
              <p className="text-[#75869b] mr-0 text-sm ">
                ({length} {t('llm:자')} / {byte} Byte )
              </p>
            </div>
          )}
        </div>
        <GeneralButton
          className={`${disableBtn ? 'cursor-not-allowed' : 'cursor-pointer'} flex !px-4 items-center  bg-white border-set-border !h-8`}
          name="clearContent"
          onClick={(e) => onClickClearContent(e)}
          disabled={disableBtn}
        >
          <img src={ico_delete_16} alt="delete" className="w-4 h-4" />
          <p className="ml-2 text-sm"> {t('llm:지우기')}</p>
        </GeneralButton>
      </div>

      {type === 'input' && (
        <Input
          {...register(registerName as keyof LlmConferenceFormProps)}
          name={registerName}
          id={registerName}
          className={`w-full text-left !h-13 `}
          onChange={handleOnchangeInput}
          placeholder={placeholder || ' '}
          disabled={disableBtn}
        />
      )}
      {type === 'textarea' && (
        <Textarea
          {...register(registerName as keyof LlmConferenceFormProps)}
          name={registerName}
          id={registerName}
          className={`w-full text-left `}
          onChange={handleOnchangeTextarea}
          placeholder={placeholder || ' '}
          disabled={disableBtn}
        />
      )}

      {helperText && (
        <div className="absolute left-0 -bottom-5 helper_text">
          <HelperText
            textColor="text-point-dark"
            iconColor="#ff3636"
            text={!errors[registerName] ? '' : helperText}
            isValid={!errors[registerName]}
          />
        </div>
      )}
    </div>
  );
};

export default InputTextParagraph;

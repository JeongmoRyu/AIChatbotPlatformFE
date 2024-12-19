import MaumIcons from '../../ToastUI/viewModel/icon-helper';

interface helperTextProps {
  textColor: string;
  text: string;
  isValid: boolean;
  iconColor?: string;
}

function HelperText({ textColor, text, isValid, iconColor }: helperTextProps) {
  return (
    <div className={isValid ? 'hidden' : 'relative flex items-center mt-3'}>
      <MaumIcons icon="AlertCircle" className={`w-4 h-4 mr-2 ${textColor}`} color={iconColor} />
      <span className={`text-sm ${textColor}`}>{text}</span>
    </div>
  );
}

export default HelperText;

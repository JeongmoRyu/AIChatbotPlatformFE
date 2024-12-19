import MaumIcons from '@/shared/components/ToastUI/viewModel/icon-helper';
export type ToastType = 'info' | 'success' | 'error';

interface Props {
  type: ToastType;
  message: string;
}

function ToastUI(props: Props) {
  const alertIcon = (type: ToastType) => {
    switch (type) {
      case 'info':
        return <MaumIcons icon="Info" className="w-6 h-6 font-semibold text-fontColor-info" />;
      case 'success':
        return <MaumIcons icon="CheckCircle" className="w-6 h-6 font-semibold text-fontColor-success" />;
      case 'error':
        return <MaumIcons icon="AlertTriangle" className="w-6 h-6 font-semibold text-fontColor-danger" />;
      default:
        break;
    }
  };

  return (
    <div className="flex toastify-content">
      {alertIcon(props.type)}
      <div className="ml-4 mr-4">
        <div className="font-semibold">{props.message}</div>
      </div>
    </div>
  );
}

export default ToastUI;

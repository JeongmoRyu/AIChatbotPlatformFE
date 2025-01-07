import { useState } from 'react';
import icon_pdf from '@/shared/assets/images/icons/ico_pdf_24.png';
import useEmbeddingRankerCodeSelect from '@/shared/hooks/useEmbeddingRankerCodeSelect';
// import { EMBEDDING_HISTORY, EMBEDDING_LEADERBOARD } from 'data/routers';
import { useNavigate } from 'react-router-dom';
import icon_etc from '@/shared/assets/images/icons/ico_etc_24.png';
import icon_xls from '@/shared/assets/images/icons/ico_xls_24.png';

interface Props {
  onChange?: (type: string, key: string, value: any) => void;
  data_id?: number;
  setIsModalVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}

const useEmbeddingSettingViewModel = ({ onChange, data_id, setIsModalVisible }: Props) => {
  const SELECT_TYPE_LIST = useEmbeddingRankerCodeSelect('SEMANTIC_CHUNKING_BP_TYPE');
  const SELECT_EMBEDDING_LIST = useEmbeddingRankerCodeSelect('SEMANTIC_CHUNKING_EMBEDDING');
  const navigate = useNavigate();
  const [selectedRrfModels, setSelectedRrfModels] = useState<IModelWeight[]>([]);
  const [rrfSelectValue, setRrfSelectValue] = useState<number>(0);
  const [rrfModelName, setRrfModelName] = useState<string>('');

  const handleChange = (type: string, key: string, value: any) => {
    if (onChange && type !== 'history') {
      onChange(type, key, value);
    }
  };
  const min = 100;
  const max = 500;
  // const currValue = 2100;
  type AccordionKeys = 'chunkSettings' | 'retrieverSettings' | 'rpf' | 'fileList' | 'embeddingList';
  const [openAccordion, setOpenAccordion] = useState({
    chunkSettings: false,
    retrieverSettings: false,
    rpf: false,
    fileList: false,
    embeddingList: false,
  });

  const handleAccordion = (e: any) => {
    const id = e.currentTarget.parentNode.getAttribute('id') as AccordionKeys;
    setOpenAccordion((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'xls':
      case 'xlsx':
        return icon_xls;
      case 'pdf':
        return icon_pdf;
      case 'txt':
        return icon_etc;
      default:
        return icon_etc;
    }
  };

  const handleModelSelect = (value: number, list: SelectListType[]) => {
    setRrfSelectValue(value);
    const selectedRrfModel = list.find((model) => model.value === value);
    if (selectedRrfModel && !selectedRrfModels.find((model) => model.model === selectedRrfModel.id)) {
      setSelectedRrfModels((prev) => [
        ...prev,
        {
          model: selectedRrfModel.id,
          weight: 0.1,
        },
      ]);
    }
  };

  const handleModelDelete = (modelName: string) => {
    setSelectedRrfModels((prev) => prev.filter((model) => model.model !== modelName));
  };

  const handleWeightChange = (modelName: string, weight: number) => {
    setSelectedRrfModels((prev) => prev.map((model) => (model.model === modelName ? { ...model, weight } : model)));
  };

  // 삭제 및 modal open
  const handleDeleteDetail = () => {
    console.log(data_id);
    setIsModalVisible && setIsModalVisible(true);
  };

  return {
    handleChange,
    openAccordion,
    handleAccordion,
    min,
    max,
    SELECT_TYPE_LIST,
    SELECT_EMBEDDING_LIST,
    rrfSelectValue,
    handleModelSelect,
    selectedRrfModels,
    handleModelDelete,
    handleWeightChange,
    rrfModelName,
    setRrfModelName,
    getFileIcon,
    handleDeleteDetail,
    navigate,
  };
};
export default useEmbeddingSettingViewModel;

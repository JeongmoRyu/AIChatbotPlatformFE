import { useEffect, useRef, useState } from 'react';

const MEMORY_OPTION: SelectListType[] = [
  { value: 0, id: 'buffer_memory', text: 'buffer memory' },
  { value: 1, id: 'window_memory', text: 'window memory' },
];
const ENDPOINT_OPTION: SelectListType[] = [{ value: 1, id: 'elastic.m-studio', text: 'elastic.m-studio' }];

interface Props {
  type: 'memory' | 'endpoint' | '';
  labelText: string;
  name: string;
  activeValue: number;
  onChange: (value: number, parameters?: IEngineParameter) => void;
  list?: SelectListType[];
  isHalf?: boolean;
}

const EditSelectBox = ({ type, labelText, name, activeValue, onChange, list, isHalf }: Props) => {
  const selectList = list ? list : type === 'memory' ? MEMORY_OPTION : type === 'endpoint' ? ENDPOINT_OPTION : [];
  const [isOpen, setIsOpen] = useState(false);
  const selectBoxRef = useRef<HTMLDivElement>(null);

  const onOpen = () => setIsOpen(!isOpen);

  const handleClickOutside = (e: MouseEvent) => {
    if (selectBoxRef.current && !selectBoxRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const isActiveValueInList = selectList.some((item) => item.value === activeValue);
    if (!isActiveValueInList && selectList.length > 0) {
      const firstItem = selectList[0];
      onChange(firstItem.value, firstItem.parameters);
    }
  }, [activeValue, selectList, onChange]);

  return (
    <div className={`select_wrap ${isHalf ? 'select_half_wrap' : ''}`}>
      <span className="txt_label" onClick={onOpen}>
        {labelText}
      </span>

      <div className={`select_box ${isOpen ? 'open' : ''}`} ref={selectBoxRef}>
        <button type="button" onClick={onOpen}>
          {selectList?.find((item) => item.value === activeValue)?.text}
          <span className="icon">{isOpen ? '닫힘' : '열림'}</span>
        </button>

        <ul className="select_list">
          {selectList?.map((item) => (
            <li key={item.id}>
              <input
                type="radio"
                id={`${name}_${item.id}`}
                name={name}
                checked={activeValue === item.value}
                onChange={() => (setIsOpen(false), onChange(item.value, item.parameters))}
              />
              <label htmlFor={`${name}_${item.id}`}>{item.text}</label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EditSelectBox;

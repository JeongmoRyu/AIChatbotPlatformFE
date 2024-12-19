import React, { useEffect, useRef, useState } from 'react';

const useSelectViewModel = (props: any) => {
  const selectboxRef = useRef<HTMLDivElement>(null);
  const selectedBtnRef = useRef<HTMLButtonElement>(null);

  const [selectedLabel, setSelectedLabel] = useState<string | undefined>('');
  const [selectedValue, setSelectedValue] = useState<string | number | undefined>('');
  const [isSelectHide, setIsSelectHide] = useState('select-hide');
  const [selectedBtnState, setSelectedBtnState] = useState('');
  const [selectboxClass, setSelectboxClass] = useState<string | undefined>('');

  const handleSelectList = () => {
    if (isSelectHide === 'select-hide') {
      setIsSelectHide('');
      setSelectedBtnState('txt-default select-arrow-active');
      setSelectboxClass(`${props.boxClassName} select-active`);
    } else if (isSelectHide === '') {
      setIsSelectHide('select-hide');
      setSelectedBtnState('');
      setSelectboxClass(props.boxClassName);
    }
  };

  const handleOnChangeSelect = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.onClick && props.onClick(e);
    const currentValue = e.currentTarget.dataset.value;
    const currentLabel = e.currentTarget.dataset.label;

    setSelectedLabel(currentLabel);
    setSelectedValue(currentValue); // 상태 업데이트 추가
    setIsSelectHide('select-hide');
    setSelectedBtnState('');
    props.onClick && props.onClick(e);
  };

  useEffect(() => {
    if (props?.placeholder) {
      setSelectedLabel(props.placeholder);
    } else {
      if (props?.typeList) {
        setSelectedLabel(props.typeList[0].label);
      }
    }
    if (props?.boxClassName) {
      setSelectboxClass(props.boxClassName);
    }
    if (props?.defaultValue) {
      setSelectedValue(props.defaultValue);
    }
    if (props?.defaultLabel) {
      setSelectedLabel(props.defaultLabel);
    }
  }, [props.defaultLabel]);

  useEffect(() => {
    if (props.reset) {
      if (props?.placeholder) {
        setSelectedLabel(props.placeholder);
      } else {
        if (props?.typeList) {
          setSelectedLabel(props.typeList[0].label);
        }
      }
    }
  }, [props.reset]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (selectboxRef.current && !selectboxRef.current.contains(e.target as Node)) {
        setIsSelectHide('select-hide');
        setSelectedBtnState('');
        setSelectboxClass(props.boxClassName);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectboxRef]);

  useEffect(() => {
    if (props.error) {
      console.log(props.error);
      selectedBtnRef.current?.focus();
      setSelectboxClass(`${props.boxClassName} select-active !rounded`);
    }
  }, [props]);

  return {
    selectboxRef,
    selectboxClass,
    selectedValue,
    selectedBtnRef,
    selectedBtnState,
    handleSelectList,
    selectedLabel,
    isSelectHide,
    handleOnChangeSelect,
  };
};

export default useSelectViewModel;

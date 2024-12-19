import { useEffect } from 'react';

type RefType = React.RefObject<HTMLElement>;
type CallbackType = () => void;

const useOutsideClick = (ref: RefType, callback: CallbackType) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};

export default useOutsideClick;

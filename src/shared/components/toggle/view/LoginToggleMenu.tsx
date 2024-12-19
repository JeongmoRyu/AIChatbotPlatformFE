import React from 'react';
import useToggleMenuViewModel from '../viewModel/useToggleMenuViewModel';

interface ToggleMenuProps {
  letter: string;
}

const LoginToggleMenu: React.FC<ToggleMenuProps> = ({ letter }) => {
  const { isToggled, setIsToggled, toggleRef, movePage, userLoginState } = useToggleMenuViewModel();

  return (
    <div className="relative">
      <button
        className="flex items-center justify-center w-10 text-base text-white rounded-full bg-secondary aspect-square"
        onClick={() => setIsToggled(!isToggled)}
      >
        {letter}
      </button>
      {isToggled && (
        <div
          className="absolute flex flex-col justify-center overflow-hidden text-center bg-white shadow-lg top-10 right-1 w-36 rounded-2xl"
          ref={toggleRef}
        >
          {userLoginState.accessToken ? (
            <div className="py-2 cursor-pointer hover:bg-primary hover:text-white" onClick={movePage}>
              Logout
            </div>
          ) : (
            <div className="py-2 cursor-pointer hover:bg-primary hover:text-white" onClick={movePage}>
              Login
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LoginToggleMenu;

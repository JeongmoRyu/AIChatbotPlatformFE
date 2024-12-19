import { Outlet } from 'react-router-dom';

const PageLLMTaskLayout = () => {
  return (
    <div className="w-full h-full py-10 desktop-lg:px-72 desktop:px-60 desktop-sm:px-24 laptop:px-72 laptop-sm:px-40 tablet:px-24">
      <div className="block h-full">
        <Outlet />
      </div>
    </div>
  );
};

export default PageLLMTaskLayout;

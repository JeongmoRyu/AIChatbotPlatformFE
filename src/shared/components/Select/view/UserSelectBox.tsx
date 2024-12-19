import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userModelList } from '@/widgets/navigation/model/useWidgetSelectModel';
import { userAuthority as useUserAuthority, userLoginState as useUserLoginState } from '@/shared/store/onpromise';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';

const UserSelectBox = () => {
  const { t } = useTranslation(['common']);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedUserModel, setSelectedUserModel] = useState<number | null>(null);
  const userLoginState = useRecoilValue(useUserLoginState);
  const userAuthority = useRecoilValue(useUserAuthority);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const currentUserName = userLoginState ? userLoginState.email : '로그인';

  const handleModelClick = (modelId: number, route: string) => {
    setSelectedUserModel(modelId);
    setIsDropdownOpen(false);
    navigate(route);
  };

  interface CategorizedModels {
    [key: string]: typeof userModelList;
  }

  const categorizedModels = userModelList.reduce<CategorizedModels>((acc, model) => {
    const category = model.category;
    if (userAuthority === '' && category === '관리자') {
      return acc;
    }
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(model);
    return acc;
  }, {});

  return (
    <div className="relative">
      <button onClick={toggleDropdown} className="flex items-center px-8 py-2 ml-2 bg-white rounded-lg shadow">
        {currentUserName}
        <span className="ml-2">
          {isDropdownOpen ? (
            <img src="/ico_up.svg" alt="logo" className="object-cover w-full h-full" />
          ) : (
            <img src="/ico_down.svg" alt="logo" className="object-cover w-full h-full" />
          )}
        </span>
      </button>
      {isDropdownOpen && (
        <ul className="absolute w-full mt-2 bg-white rounded-lg shadow-lg">
          {Object.entries(categorizedModels).map(([category, models]) => (
            <li key={category} className="text-gray-700 ">
              <div className="font-bold text-[#7B8188] px-3.5 py-2 text-[12px]">{t(category)}</div>
              <ul>
                {models.map((model: any) => (
                  <li
                    key={model.id}
                    className={`px-3.5 py-2 cursor-pointer hover:bg-gray-200 text-[14px] ${selectedUserModel === model.id ? 'bg-gray-200' : ''}`}
                    onClick={() => handleModelClick(model.id, model.route)}
                  >
                    {t(model.name)}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSelectBox;

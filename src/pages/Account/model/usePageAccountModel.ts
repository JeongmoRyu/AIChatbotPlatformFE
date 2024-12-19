export const DEFAULT_USER_DATA: UserListType = {
  username: '',
  password: '',
  name: '',
  sex: 'M',
  birth_year: '',
  // admin: 'Admin',
  is_editor: false,
  is_admin: false,
  is_super_admin: false,
  user_key: 0,
};

export const AccountWorksheetColumns = [
  { header: 'ID', key: 'id', width: 30 },
  { header: 'PW', key: 'password', width: 50 },
  { header: '이름', key: 'name', width: 20 },
  { header: '권한', key: 'authority', width: 40 },
];

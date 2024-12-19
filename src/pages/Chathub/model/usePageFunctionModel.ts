export interface DefaultFunctionsValueType {
  description: string;
  file_list: FileType[];
  filter_prefix: string;
  id: number;
  img_path: string;
  name: string;
  pre_info_type: number[];
  question_image: string;
  question_name: string;
  question_detail: string;
}

export const DEFAULT_VALUE: DefaultFunctionsValueType = {
  description: '',
  file_list: [],
  filter_prefix: '',
  id: 0,
  img_path: '',
  name: '',
  pre_info_type: [],
  question_image: '',
  question_name: '',
  question_detail: '',
};

// API 관련 함수들
export const fetchLibrary = async (sendRequest: any) => {
  return await sendRequest('/library', 'get');
};

export const fetchFunctionDetail = async (sendRequest: any, id: number) => {
  return await sendRequest(`/function/${id}`, 'get');
};

export const saveFunction = async (
  sendRequest: any,
  url: string,
  method: string,
  detailData: DefaultFunctionsValueType,
) => {
  return await sendRequest(url, method, undefined, detailData);
};

export const deleteFunction = async (sendRequest: any, functionId: number) => {
  return await sendRequest(`/function/${functionId}`, 'delete', undefined);
};

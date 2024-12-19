import { HiFolderDownload } from 'react-icons/hi';

import useRetrievalDetailTable from '../viewModel/useRetrievalDetailTable';
import { useTranslation } from 'react-i18next';

interface Props {
  fetchDetailData: fetchRetreivalDetailProps[];
}

function RetrievalDetailTable({ fetchDetailData }: Props) {
  const { t } = useTranslation(['rag']);

  const { downloadFile } = useRetrievalDetailTable();

  return (
    <div className="w-full overflow-x-auto">
      <table className="tableChatplay">
        <thead>
          <tr>
            <th className="px-1 whitespace-nowrap" scope="col">
              No
            </th>
            <th className="px-1 whitespace-nowrap" scope="col">
              {t('rag:파일_명')}
            </th>
            <th className="px-1 whitespace-nowrap" scope="col">
              {t('rag:파일_크기')}
            </th>

            <th className="px-1 whitespace-nowrap" scope="col">
              {t('rag:파일_다운로드')}
            </th>
          </tr>
        </thead>

        <tbody>
          {fetchDetailData &&
            fetchDetailData.map((item: any, index) => (
              <tr key={`${item.no}${index}`}>
                <td>{item.no}</td>

                <td>
                  <div>{item.file_name}</div>
                </td>

                <td>{item.file_size}</td>
                <td className="flex items-center justify-center">
                  <button
                    type="button"
                    name="download"
                    className="bg-white border-none max-h-10"
                    onClick={() => {
                      downloadFile(item.download_url, item.file_name);
                    }}
                  >
                    <HiFolderDownload size="27" color="#002266" />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default RetrievalDetailTable;

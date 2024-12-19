import React from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

import { getByteSize } from '@/shared/utils/chat-play-helper';

import FileUploadListViewModel from '../viewModel/FileUploadListViewModel';

import icoInfo from '@/shared/assets/images/image/chatplay/ico_info@2x.png';
import GarbageCan from '@/shared/assets/images/image/chatplay/ico_delete.png';

export default function FileUploadList({
  uploadFiles,
  setUploadFiles,
}: {
  uploadFiles: File[];
  setUploadFiles: React.Dispatch<React.SetStateAction<File[]>>;
}) {
  const { t } = useTranslation(['chatplay']);

  const { onDrop, isPDFDrag, handleDragEnter, handleDragLeave, handleDrop, handleDragOver, handleSrc } =
    FileUploadListViewModel({ uploadFiles, setUploadFiles });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
  });

  return (
    <>
      <div
        className={`bg-black opacity-40 w-full h-full absolute top-0 left-0 p-10 ${isPDFDrag ? 'block' : `hidden`}`}
        {...getRootProps({
          onDragEnter: handleDragEnter,
          onDragLeave: handleDragLeave,
          onDrop: handleDrop,
        })}
      >
        <input
          className=" border-2 border-dashed rounded-3xl border-white !w-96 !h-96 pointer-events-none "
          {...getInputProps()}
        />
      </div>

      {uploadFiles?.length > 0 ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
          onDragEnter={handleDragEnter}
        >
          {/* 체크 리스트 */}
          <table className="tableChatplay ">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-1 !h-10" scope="col">
                  No
                </th>
                <th className="whitespace-nowrap px-1 !h-10" scope="col">
                  {t('rag:파일명')}
                </th>
                <th className="whitespace-nowrap px-1 !h-10" scope="col">
                  {t('rag:사이즈')}
                </th>
                <th className="whitespace-nowrap px-1 !h-10" scope="col">
                  {t('rag:삭제')}
                </th>
              </tr>
            </thead>

            <tbody>
              {uploadFiles.length > 0 &&
                uploadFiles.map((item: File, fileindex) => (
                  <tr key={`${item.name}${fileindex}`}>
                    <td className="!h-10">{fileindex + 1}</td>
                    <td className="flex items-center justify-center !h-12">
                      <div className="flex mb-2">
                        <img
                          src={handleSrc(item.type)}
                          alt="Update"
                          className="inline-block object-contain w-5 h-5 mr-2"
                        />
                        <span className="overflow-hidden text-left w-80 whitespace-nowrap text-ellipsis">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="!h-10">
                      <span className="text-gray">{getByteSize(item.size)}</span>
                    </td>
                    <td className="!h-10">
                      <button>
                        <img
                          src={GarbageCan}
                          alt="Garbage Can Icon"
                          className="object-contain w-full h-full"
                          onClick={() => {
                            setUploadFiles((prev) => {
                              const updatedFiles = prev.filter((_, index) => index !== fileindex);
                              return updatedFiles;
                            });
                          }}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              {Array.from({ length: 5 - uploadFiles.length }).map((_, index) => (
                <tr key={`empty-${index}`}>
                  <td className="!h-10">&nbsp;</td>
                  <td className="!h-10">&nbsp;</td>
                  <td className="!h-10">&nbsp;</td>
                  <td className="!h-10">&nbsp;</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between">
            <div>
              <p className="text-sm">
                <span className="ml-1 text-red-500">*</span>
                {t('rag:각_파일의_최대_사이즈는_30MB_이내이며_5개까지_등록_가능합니다')}
              </p>
              <p className="text-sm">
                <span className="ml-1 text-red-500">*</span>
                {t('rag:등록_가능_파일은_pdf_입니다')}
              </p>
            </div>
            <div className="mt-3 text-sm text-gray">
              {getByteSize(uploadFiles.reduce((acc, file) => acc + file.size, 0))} / 150MB
            </div>
          </div>
        </div>
      ) : (
        <div
          className="w-full overflow-x-auto"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
        >
          <table className="pointer-events-none tableChatplay">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-1 !h-12" scope="col">
                  No
                </th>
                <th className="whitespace-nowrap px-1 !h-12" scope="col">
                  {t('rag:파일명')}
                </th>
                <th className="whitespace-nowrap px-1 !h-12" scope="col">
                  {t('rag:사이즈')}
                </th>
                <th className="whitespace-nowrap px-1 !h-12" scope="col">
                  {t('rag:삭제')}
                </th>
              </tr>
            </thead>

            <tbody></tbody>
          </table>

          <div className="w-full h-[190px] flex justify-center flex-col border-b border-set-border items-center pointer-events-none">
            <div className="flex items-center justify-center gap-2">
              <div className="flex-grow" />
              <div className="!flex items-center justify-center text-center !h-64 !w-full">
                <p className="flex items-center justify-between">
                  <img src={icoInfo} alt="info" className="inline-block object-contain w-5 h-5 mr-2" />
                  {t('rag:pdf_파일을_끌어와_파일을_업로드해주세요')}
                </p>
              </div>

              <div className="flex-grow" />
            </div>
          </div>

          <div className="flex justify-between">
            <div>
              <p className="text-sm">
                <span className="ml-1 text-red-500">*</span>
                {t('rag:각_파일의_최대_사이즈는_30MB_이내이며_5개까지_등록_가능합니다')}
              </p>
              <p className="text-sm">
                <span className="ml-1 text-red-500">*</span>
                {t('rag:등록_가능_파일은_pdf_입니다')}
              </p>
            </div>
            <span className="mt-3 text-sm text-gray">0 / 150MB</span>
          </div>
        </div>
      )}
    </>
  );
}

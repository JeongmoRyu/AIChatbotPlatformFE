const useRetrievalDetailTable = () => {
  const downloadFile = (url: string, fileName: string) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || 'downloaded-file';
        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error('download file error', error);
      });
  };
  return { downloadFile };
};

export default useRetrievalDetailTable;

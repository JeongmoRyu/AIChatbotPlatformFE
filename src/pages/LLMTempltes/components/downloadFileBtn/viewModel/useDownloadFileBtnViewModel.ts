import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';

const useDownloadFileBtnViewModel = ({
  fileSummaryContent,
  fileTitleContent,
  fileContentContent,
  name,
}: DownloadFileBtnProps) => {
  const today = new Date();
  const formattedDate = ` ${
    today.getMonth() + 1
  }${today.getDate()}${today.getHours()}${today.getMinutes()}${today.getSeconds()}`;

  const handleDownloadFile = async () => {
    const fileSummary = fileSummaryContent || '';
    const fileTitle = fileTitleContent || '';
    const fileSentence = fileContentContent?.split('\n').map((line) => new TextRun({ break: 1, text: line }));

    console.log('fileSummary', fileSummary);
    console.log('fileTitle', fileTitle);
    console.log('fileSentence', fileSentence);

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun(fileSummary)],
            }),
            new Paragraph({}),
            new Paragraph({
              children: [new TextRun(fileTitle)],
            }),
            new Paragraph({}),
            new Paragraph({
              children: fileSentence,
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob: any) => {
      saveAs(blob, `${name}_${formattedDate}.docx`);
    });
  };
  return { handleDownloadFile };
};

export default useDownloadFileBtnViewModel;

export const TABS: toggleListProps[] = [
  { id: 'QaData', label: 'QA 데이터' },
  { id: 'Ranking', label: '랭킹' },
];

export const qaWorksheetColumns = [
  { header: 'No', key: 'row_number', width: 10 },
  { header: 'Question', key: 'question', width: 30 },
  { header: 'Answer', key: 'answer', width: 30 },
  { header: 'doc_id', key: 'doc_id', width: 15 },
  { header: 'chunk', key: 'chunk', width: 15 },
];

export const rankingWorksheetColumns = [
  { header: 'No', key: 'row_number', width: 10 },
  { header: 'Name', key: 'model_name', width: 30 },
  { header: 'Embedding Model', key: 'embedding_model_config', width: 30 },
  { header: 'Hit Accuracy', key: 'hit_accuracy', width: 15 },
  { header: 'Description', key: 'description', width: 15 },
];

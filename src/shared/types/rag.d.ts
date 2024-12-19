interface IDesignParams {
  filter: designListFilterTypes;
  query: string | null;
  start_date: string | null;
  end_date: string | null;
  limit?: number;
}

interface fetchRetreivalDetailProps {
  no: number;
  file_name: string;
  file_size: string;
  download_url: string;
}

import usePaginationViewModel from '../viewModel/usePaginationViewModel';

const DataSourcePagination = () => {
  const { currentPage, setCurrentPage, pageGroup, pages, pageCount } = usePaginationViewModel();

  return (
    <nav className="paging mt-10">
      <button
        type="button"
        className={`page-link prev-first ${currentPage === 1 ? 'disabled' : ''}`}
        onClick={() => setCurrentPage(1)}
      >
        처음으로
      </button>
      <button
        type="button"
        className={`page-link prev ${currentPage === 1 ? 'disabled' : ''}`}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        이전
      </button>
      {pageGroup.length &&
        pageGroup.map((page) => {
          if (pages.length > 0) {
            return (
              <button
                key={`pagination_${page}`}
                type="button"
                className={`page-link ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            );
          }
        })}
      <button
        type="button"
        className={`page-link next ${currentPage === pageCount ? 'disabled' : ''}`}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        다음
      </button>
      <button
        type="button"
        className={`page-link next-end ${currentPage === pageCount ? 'disabled' : ''}`}
        onClick={() => setCurrentPage(pageCount)}
      >
        마지막으로
      </button>
    </nav>
  );
};

export default DataSourcePagination;

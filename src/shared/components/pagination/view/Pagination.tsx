import usePaginationViewModel from '../viewModel/usePaginationViewModel';

function Pagination() {
  const { currentPage, setCurrentPage, pageGroup, pages, pageCount } = usePaginationViewModel();

  return (
    <div className="mt-10 paging">
      <nav>
        <ul>
          <li className="page-item">
            <a
              className={currentPage === 1 ? 'page-link prev disabled' : 'page-link prev'}
              href="#"
              onClick={() => setCurrentPage(currentPage - 1)}
            ></a>
          </li>
          <>
            {pageGroup.length &&
              pageGroup.map((page) => {
                if (pages.length > 0) {
                  return (
                    <li key={page} className="page-item">
                      <a
                        className={currentPage === page ? 'page-link active' : 'page-link'}
                        href="#"
                        onClick={() => {
                          setCurrentPage(page);
                        }}
                      >
                        {page}
                      </a>
                    </li>
                  );
                }
              })}
          </>
          <li className="page-item">
            <a
              className={currentPage === pageCount ? 'page-link next disabled' : 'page-link next'}
              href="#"
              onClick={() => setCurrentPage(currentPage + 1)}
            ></a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Pagination;

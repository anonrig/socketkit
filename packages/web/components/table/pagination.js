import PropTypes from 'prop-types'

function Pagination({
  canPreviousPage,
  canNextPage,
  nextPage,
  previousPage,
  currentPage,
  pageCount,
}) {
  return (
    <nav className="border-t border-gray-200 px-4 flex items-center justify-between">
      <div className="-mt-px w-0 flex-1 flex">
        <button
          className="border-t-2 border-transparent pr-1 py-4 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
          disabled={!canPreviousPage}
          onClick={() => previousPage()}
        >
          <svg
            aria-hidden="true"
            className="mr-3 h-5 w-5 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
              fillRule="evenodd"
            />
          </svg>
          Previous
        </button>
      </div>
      <div className="md:-mt-px md:flex">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{currentPage}</span> of{' '}
          <span className="font-medium">{pageCount}</span> pages
        </p>
      </div>
      <div className="-mt-px w-0 flex-1 flex justify-end">
        <button
          className="border-t-2 border-transparent pl-1 py-4 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
          disabled={!canNextPage}
          onClick={() => nextPage()}
        >
          Next
          <svg
            aria-hidden="true"
            className="ml-3 h-5 w-5 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
              fillRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </nav>
  )
}

Pagination.propTypes = {
  canPreviousPage: PropTypes.bool,
  canNextPage: PropTypes.bool,
  nextPage: PropTypes.func.isRequired,
  previousPage: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
}

export default Pagination

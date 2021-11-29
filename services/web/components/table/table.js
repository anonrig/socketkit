/* eslint-disable react/jsx-key */
import cx from 'classnames'
import { getQueryString } from 'helpers/fetcher.js'
import PropTypes from 'prop-types'
import { Fragment, useMemo, useRef, useEffect, useCallback } from 'react'
import { useTable, useExpanded } from 'react-table'
import useSWRInfinite from 'swr/infinite'

import useOnScreen from '../../helpers/use-onscreen.js'

function Table({
  fallbackData,
  columns,
  getRowProps,
  url,
  options,
  notFound,
  renderRowSubComponent,
}) {
  const loader = useRef()
  const isVisible = useOnScreen(loader)
  const getPaginationKey = useCallback(
    (_page, previous) => {
      if (previous && !previous.cursor) return null
      const query = getQueryString(
        Object.assign({}, options, previous?.cursor ? { cursor: previous.cursor } : {}),
      )

      return query.length > 0 ? `${url}?${query}` : url
    },
    [options, url],
  )
  const { data, size, setSize, isValidating, error } = useSWRInfinite(getPaginationKey, {
    fallbackData: fallbackData ? [fallbackData] : undefined,
    refreshInterval: 0,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    revalidateAll: false,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnMount: false,
  })

  const isLoadingfallbackData = !data && !error
  const isLoadingMore =
    isLoadingfallbackData || (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isEmpty = data?.[0]?.rows.length === 0

  useEffect(() => {
    if (isVisible && !isValidating && !isLoadingfallbackData && !isLoadingMore && !isEmpty) {
      setSize(size + 1)
    }
  }, [isVisible, isValidating, isLoadingfallbackData, isLoadingMore, isEmpty, size, setSize])

  const memoized = useMemo(() => data?.map((d) => d.rows).flat() ?? [], [data])

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, visibleColumns } =
    useTable(
      {
        columns,
        data: memoized,
      },
      useExpanded,
    )

  if (!isLoadingfallbackData && !isLoadingMore && isEmpty) {
    return (
      <div className="shadow-lgs sm:rounded-lg my-4">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-trueGray-900">{notFound.title}</h3>
          <p className="mt-2 max-w-xl text-sm text-gray-500">{notFound.message}</p>
          {notFound.action && (
            <button
              className="mt-3 text-sm font-medium text-orange-500 hover:text-orange-400"
              onClick={() => notFound.action.callback()}
            >
              {notFound.action.message} <span aria-hidden="true">&rarr;</span>
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200" {...getTableProps()}>
                <thead className="bg-warmGray-50">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          className={cx([
                            'px-6 py-3 text-left text-xs font-medium text-trueGray-500 uppercase tracking-wider',
                            column.className,
                          ])}
                          scope="col"
                          {...column.getHeaderProps()}
                        >
                          {column.render('Header')}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200" {...getTableBodyProps()}>
                  {rows.map((row) => {
                    prepareRow(row)

                    const { key } = row.getRowProps()

                    return (
                      <Fragment key={key}>
                        <tr
                          className="hover:bg-warmGray-50 cursor-pointer"
                          {...row.getRowProps(getRowProps(row))}
                        >
                          {row.cells.map((cell) => {
                            return (
                              <td
                                className={cx([
                                  'px-6 py-4 text-sm text-trueGray-500 whitespace-nowrap md:whitespace-normal',
                                  cell.column.className,
                                ])}
                                {...cell.getCellProps()}
                              >
                                {cell.render('Cell')}
                              </td>
                            )
                          })}
                        </tr>

                        {row.isExpanded ? (
                          <tr>
                            <td colSpan={visibleColumns.length}>
                              {renderRowSubComponent({ row })}
                            </td>
                          </tr>
                        ) : null}
                      </Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div ref={loader} className="w-full h-4"></div>
    </>
  )
}

Table.defaultProps = {
  notFound: {
    action: null,
    message: `Try adjusting your search or filter to find what you're looking for.`,
    title: 'No results found',
  },
}

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.any).isRequired,
  fallbackData: PropTypes.any,
  getRowProps: PropTypes.func,
  notFound: PropTypes.shape({
    action: PropTypes.shape({
      callback: PropTypes.func,
      message: PropTypes.string,
    }),
    message: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
  options: PropTypes.shape({
    from: PropTypes.string,
    limit: PropTypes.number,
    to: PropTypes.string,
  }),
  renderRowSubComponent: PropTypes.func,
  url: PropTypes.string.isRequired,
}

export default Table

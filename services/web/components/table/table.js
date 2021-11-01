/* eslint-disable react/jsx-key */
import { Fragment } from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import { useMemo, useRef, useEffect } from 'react'
import { useTable, useExpanded } from 'react-table'
import { useSWRInfinite } from 'swr'
import { fetcher, getQueryString } from 'helpers/fetcher.js'
import useOnScreen from '../../helpers/use-onscreen.js'

function Table({
  initialData,
  columns,
  getRowProps,
  url,
  options,
  notFound,
  renderRowSubComponent,
}) {
  const loader = useRef()
  const isVisible = useOnScreen(loader)
  const { data, size, setSize, isValidating, error } = useSWRInfinite(
    (_, previous) => {
      if (previous && !previous.cursor) return null
      const query = getQueryString(
        Object.assign({}, options, previous?.cursor ? { cursor: previous.cursor } : {}),
      )

      return query.length > 0 ? `${url}?${query}` : url
    },
    fetcher,
    {
      refreshInterval: 0,
      refreshWhenHidden: false,
      refreshWhenOffline: false,
      revalidateOnFocus: false,
      initialData: initialData ? [initialData] : undefined,
    },
  )

  const isLoadingInitialData = !data && !error
  const isLoadingMore =
    isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isEmpty = data?.[0]?.rows.length === 0

  useEffect(() => {
    if (isVisible && !isValidating && !isLoadingInitialData && !isLoadingMore && !isEmpty) {
      setSize(size + 1)
    }
  }, [isVisible, isValidating, isLoadingInitialData, isLoadingMore, isEmpty, size, setSize])

  const memoized = useMemo(() => data?.map((d) => d.rows).flat() ?? [], [data])

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, visibleColumns } =
    useTable(
      {
        columns,
        data: memoized,
      },
      useExpanded,
    )

  if (!isLoadingInitialData && !isLoadingMore && isEmpty) {
    return (
      <div className="shadow-lgs sm:rounded-lg my-4">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-trueGray-900">{notFound.title}</h3>
          <p className="mt-2 max-w-xl text-sm text-gray-500">{notFound.message}</p>
          {notFound.action && (
            <button
              className="mt-3 text-sm font-medium text-orange-500 hover:text-orange-400"
              onClick={() => notFound.action.callback()}>
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
                          {...column.getHeaderProps()}>
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
                          {...row.getRowProps(getRowProps(row))}>
                          {row.cells.map((cell) => {
                            return (
                              <td
                                className={cx([
                                  'px-6 py-4 text-sm text-trueGray-500 whitespace-nowrap md:whitespace-normal',
                                  cell.column.className,
                                ])}
                                {...cell.getCellProps()}>
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
    title: 'No results found',
    message: `Try adjusting your search or filter to find what you're looking for.`,
    action: null,
  },
}

Table.propTypes = {
  initialData: PropTypes.any,
  url: PropTypes.string.isRequired,
  options: PropTypes.shape({
    limit: PropTypes.number,
    from: PropTypes.string,
    to: PropTypes.string,
  }),
  columns: PropTypes.arrayOf(PropTypes.any).isRequired,
  getRowProps: PropTypes.func,
  notFound: PropTypes.shape({
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    action: PropTypes.shape({
      message: PropTypes.string,
      callback: PropTypes.func,
    }),
  }),
  renderRowSubComponent: PropTypes.func,
}

export default Table
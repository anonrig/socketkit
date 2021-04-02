/* eslint-disable react/jsx-key */
import cx from 'classnames'
import PropTypes from 'prop-types'
import { useMemo, useRef, useEffect } from 'react'
import { useTable } from 'react-table'
import { useSWRInfinite } from 'swr'
import { fetcher } from 'helpers/fetcher.js'
import useOnScreen from '../../helpers/use-onscreen.js'

function Table({ initialData, columns, getRowProps, url, options }) {
  const loader = useRef()
  const getKey = (index, previous) => {
    const query = Object.keys(options)
      .sort()
      .map((k) => `${k}=${options[k]}`)
      .join('&')

    if (previous && !previous.cursor) return null
    if (index === 0) {
      return query.length > 0 ? `${url}?${query}` : url
    }
    const cursor = Object.keys(previous.cursor)
      .sort()
      .map((k) => `cursor[${k}]=${previous.cursor[k]}`)
      .join('&')

    return `${url}?${query}&${cursor}`
  }

  const isVisible = useOnScreen(loader)
  const { data, size, setSize, isValidating } = useSWRInfinite(getKey, fetcher, {
    refreshInterval: false,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    initialData: initialData ? [initialData] : undefined,
  })

  const memoized = useMemo(() => data?.map((d) => d.rows).flat() ?? [], [data])

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: memoized,
  })

  useEffect(() => {
    if (isVisible && !isValidating) {
      setSize(size + 1)
    }
  }, [isVisible, isValidating])

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

                    return (
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
}

export default Table

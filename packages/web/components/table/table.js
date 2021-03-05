/* eslint-disable react/jsx-key */
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { useTable } from 'react-table'
import { Waypoint } from 'react-waypoint'
import { useSWRInfinite } from 'swr'
import { fetcher } from '../../helpers/fetcher.js'
import cx from 'classnames'

function Table({ initialData, columns, getRowProps, url, options }) {
  const getKey = (_, previous) => {
    const query = Object.keys(options)
      .map((k) => `${k}=${options[k]}`)
      .join('&')

    if (previous) {
      if (previous.cursor) {
        const cursor = Object.keys(previous.cursor)
          .map((k) => `cursor[${k}]=${previous.cursor[k]}`)
          .join('&')
        return `${url}?${query}&${cursor}`
      } else {
        return null
      }
    }

    return `${url}?${query}`
  }

  const { data, size, setSize } = useSWRInfinite(getKey, fetcher, {
    refreshInterval: 0,
    initialData: initialData ? [initialData] : undefined,
  })

  // @ts-ignore
  let records = data?.map((d) => d.rows).flat() ?? []

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: useMemo(() => records, [data, size]),
  })

  return (
    <>
      <div className="flex flex-col min-h-screen">
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
                                'px-6 py-4 whitespace-nowrap text-sm text-trueGray-500',
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
      {records.length > 0 && <Waypoint key={'table'} onEnter={() => setSize(size + 1)} />}
    </>
  )
}

Table.propTypes = {
  initialData: PropTypes.any,
  url: PropTypes.string.isRequired,
  options: PropTypes.shape({
    limit: PropTypes.number.isRequired,
    from: PropTypes.string,
    to: PropTypes.string,
  }),
  columns: PropTypes.arrayOf(PropTypes.any).isRequired,
  getRowProps: PropTypes.func,
}

export default Table

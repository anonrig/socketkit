import dayjs from 'dayjs'
import { EventKeys } from 'helpers/types/event.js'
import PropTypes from 'prop-types'
import { useMemo } from 'react'

function ExpandedCell({ row }) {
  const client = useMemo(() => Object.entries(row.client), [row.client])

  return (
    <ul className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-3 divide-y divide-stone-200 bg-stone-50">
      {client.map(([key, value]) => (
        <li key={key} className="col-span-1">
          <div className="w-full flex items-center justify-between px-8 py-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-stone-900 text-xs font-medium">
                  {EventKeys[key.toString()] ?? key}:
                </h3>
                <span className="text-stone-900 text-xs font-semibold">
                  {['created_at', 'updated_at'].includes(key)
                    ? dayjs(value).format('YYYY-MM-DD')
                    : value}
                </span>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

ExpandedCell.propTypes = {
  row: PropTypes.object.isRequired,
}

export default ExpandedCell

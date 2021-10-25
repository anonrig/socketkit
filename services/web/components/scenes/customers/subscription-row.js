import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import Link from 'next/link'

import { CalendarIcon } from '@heroicons/react/outline'
import { ChevronRightIcon } from '@heroicons/react/solid'

function SubscriptionRow({
  application_id,
  application_name,
  subscription_active_period,
  subscription_package_name,
}) {
  return (
    <Link href={`/applications/${application_id}/general`}>
      <a className="block hover:bg-gray-50">
        <div className="px-4 py-4 flex items-center sm:px-6">
          <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <div className="flex text-sm font-semibold text-orange-500 truncate">
                <p>{subscription_package_name}</p>
                <p className="ml-1 font-normal text-warmGray-500">in {application_name}</p>
              </div>
              <div className="mt-2 flex">
                <div className="flex flex-1 items-center text-sm text-warmGray-500">
                  <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-warmGray-500" />
                  <p className="flex-1">
                    Ending on{' '}
                    <time
                      dateTime={dayjs(subscription_active_period[1]).format('YYYY-MM-DD')}
                      className="font-bold">
                      {dayjs(subscription_active_period[1]).format('YYYY-MM-DD')}
                    </time>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="ml-5 flex-shrink-0">
            <ChevronRightIcon className="h-5 w-5 text-warmGray-400" />
          </div>
        </div>
      </a>
    </Link>
  )
}

SubscriptionRow.propTypes = {
  application_id: PropTypes.string.isRequired,
  application_name: PropTypes.string.isRequired,
  subscription_package_id: PropTypes.string.isRequired,
  subscription_package_name: PropTypes.string.isRequired,
  subscription_active_period: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default SubscriptionRow

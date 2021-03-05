import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import Link from 'next/link'

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
                <div className="flex items-center text-sm text-warmGray-500">
                  <svg
                    aria-hidden="true"
                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-warmGray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      clipRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      fillRule="evenodd"
                    />
                  </svg>
                  <p>
                    Ending on{' '}
                    <time dateTime={dayjs(subscription_active_period[1]).format('YYYY-MM-DD')}>
                      {dayjs(subscription_active_period[1]).format('YYYY-MM-DD')}
                    </time>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="ml-5 flex-shrink-0">
            <svg
              className="h-5 w-5 text-warmGray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
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

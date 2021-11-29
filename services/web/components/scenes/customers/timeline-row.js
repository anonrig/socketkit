import {
  UserAddIcon,
  ReceiptRefundIcon,
  InformationCircleIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/solid'
import cx from 'classnames'
import dayjs from 'dayjs'
import Link from 'next/link'
import PropTypes from 'prop-types'

function TimelineRow({
  indicatorEnabled,
  entry: {
    event_date,
    transaction_type,
    base_subscriber_purchase,
    base_developer_proceeds,
    subscription_package_id,
    subscription_package_name,
  },
}) {
  const price = parseFloat(base_subscriber_purchase).toFixed(2)
  const proceed = parseFloat(base_developer_proceeds).toFixed(2)

  const getLabel = () => {
    if (transaction_type === 'refund') {
      return (
        <p className="text-sm text-warmGray-500 flex-1">
          Refund accepted for <span className="font-medium text-warmGray-900">{price}$</span>
        </p>
      )
    } else if (transaction_type === 'renewal') {
      return (
        <p className="text-sm text-warmGray-500 flex-1">
          Subscription renewed for <span className="font-medium text-warmGray-900">{proceed}$</span>
        </p>
      )
    } else if (transaction_type === 'conversion') {
      return (
        <p className="text-sm text-warmGray-500 flex-1">
          Converted to paid user for{' '}
          <span className="font-medium text-warmGray-900">{proceed}$</span>
        </p>
      )
    } else {
      return (
        <p className="text-sm text-warmGray-500 flex-1">
          Started free trial{' '}
          <Link href={`/subscriptions/${subscription_package_id}`}>
            <a className="font-medium text-warmGray-900">{subscription_package_name}</a>
          </Link>
        </p>
      )
    }
  }

  return (
    <li>
      <div className={cx(['relative', indicatorEnabled ? 'pb-8' : ''])}>
        {indicatorEnabled && (
          <span
            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
            aria-hidden="true"
          />
        )}

        <div className="relative flex space-x-3">
          <div className="">
            {transaction_type === 'renewal' ? (
              <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                <CurrencyDollarIcon className="h-5 w-5 text-white" />
              </span>
            ) : transaction_type === 'refund' ? (
              <span className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center ring-8 ring-white">
                <ReceiptRefundIcon className="h-5 w-5 text-white" />
              </span>
            ) : transaction_type === 'conversion' ? (
              <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                <UserAddIcon className="h-5 w-5 text-white" />
              </span>
            ) : (
              <span className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center ring-8 ring-white">
                <InformationCircleIcon className="h-5 w-5 text-white" />
              </span>
            )}
          </div>
          <div className="flex-1 flex items-center space-x-4">
            {getLabel()}
            <div className="text-right text-sm whitespace-nowrap text-gray-500">
              <time dateTime={dayjs(event_date).format('YYYY-MM-DD')}>
                {dayjs(event_date).format('MMM DD')}
              </time>
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}

TimelineRow.propTypes = {
  entry: PropTypes.shape({
    application_id: PropTypes.string.isRequired,
    application_name: PropTypes.string.isRequired,
    base_developer_proceeds: PropTypes.string.isRequired,
    base_subscriber_purchase: PropTypes.string.isRequired,
    event_date: PropTypes.string.isRequired,
    subscription_package_id: PropTypes.string.isRequired,
    subscription_package_name: PropTypes.string.isRequired,
    transaction_type: PropTypes.string.isRequired,
  }).isRequired,
  indicatorEnabled: PropTypes.bool,
}

export default TimelineRow

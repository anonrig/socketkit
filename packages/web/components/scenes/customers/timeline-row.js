import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import Link from 'next/link'
import cx from 'classnames'

import PaidIcon from './paid-icon.js'
import RefundIcon from './refund-icon.js'
import TrialIcon from './trial-icon.js'

function TimelineRow({
  indicatorEnabled,
  entry: {
    event_date,
    transaction_type,
    base_client_purchase,
    base_developer_proceeds,
    subscription_package_id,
    subscription_package_name,
  },
}) {
  const price = parseFloat(base_client_purchase).toFixed(2)
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
              <PaidIcon />
            ) : transaction_type === 'refund' ? (
              <RefundIcon />
            ) : (
              <TrialIcon />
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
    base_client_purchase: PropTypes.string.isRequired,
    base_developer_proceeds: PropTypes.string.isRequired,
    transaction_type: PropTypes.string.isRequired,
    subscription_package_id: PropTypes.string.isRequired,
    subscription_package_name: PropTypes.string.isRequired,
    event_date: PropTypes.string.isRequired,
  }).isRequired,
  indicatorEnabled: PropTypes.bool,
}

export default TimelineRow

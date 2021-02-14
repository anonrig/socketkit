import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import Link from 'next/link'
import PaidIcon from './paid-icon.js'
import RefundIcon from './refund-icon.js'
import TrialIcon from './trial-icon.js'

function TimelineRow({
  event_date,
  transaction_type,
  base_client_purchase,
  base_developer_proceeds,
  subscription_package_id,
  subscription_package_name,
}) {
  const price = parseFloat(base_client_purchase).toFixed(2)
  const proceed = parseFloat(base_developer_proceeds).toFixed(2)
  const getLabel = () => {
    if (transaction_type === 'refund') {
      return (
        <p className="text-sm text-gray-500">
          Refund accepted for{' '}
          <span className="font-medium text-gray-900">{price}$</span>
        </p>
      )
    } else if (transaction_type === 'renewal') {
      return (
        <p className="text-sm text-gray-500">
          Renewed for{' '}
          <span className="font-medium text-gray-900">{price}$</span> and
          proceeded{' '}
          <span className="font-medium text-gray-900">{proceed}$</span>
        </p>
      )
    } else {
      return (
        <p className="text-sm text-gray-500">
          Started free trial{' '}
          <Link href={`/subscriptions/${subscription_package_id}`}>
            <a className="font-medium text-gray-900">
              {subscription_package_name}
            </a>
          </Link>
        </p>
      )
    }
  }

  return (
    <li>
      <div className="relative pb-8">
        <div className="relative flex space-x-3">
          <div>
            {transaction_type === 'renewal' ? (
              <PaidIcon />
            ) : transaction_type === 'refund' ? (
              <RefundIcon />
            ) : (
              <TrialIcon />
            )}
          </div>
          <div className="min-w-0 flex-1 flex justify-between space-x-4">
            <div>{getLabel()}</div>
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
  application_id: PropTypes.string.isRequired,
  application_name: PropTypes.string.isRequired,
  base_client_purchase: PropTypes.string.isRequired,
  base_developer_proceeds: PropTypes.string.isRequired,
  transaction_type: PropTypes.string.isRequired,
  subscription_package_id: PropTypes.string.isRequired,
  subscription_package_name: PropTypes.string.isRequired,
  event_date: PropTypes.string.isRequired,
}

export default TimelineRow

import cx from 'classnames'
import PropTypes from 'prop-types'

function IntegrationRow({ title, description, action, onAction, className }) {
  return (
    <div
      className={cx(
        'rounded-md px-6 py-5 flex items-left md:items-center justify-between border border-gray-200 flex-col md:flex-row',
        className,
      )}
    >
      <div className="flex items-leading justify-center flex-col mb-4 md:mb-0">
        <div className="text-md font-medium text-warmGray-900">{title}</div>
        <div className="text-sm text-trueGray-500 flex items-center">{description}</div>
      </div>
      <button
        onClick={() => onAction()}
        className="w-full md:w-auto inline-flex justify-center items-center px-4 py-2 shadow-sm text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
      >
        {action}
      </button>
    </div>
  )
}

IntegrationRow.propTypes = {
  action: PropTypes.string.isRequired,
  className: PropTypes.string,
  description: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
  ]),
  onAction: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
}

export default IntegrationRow

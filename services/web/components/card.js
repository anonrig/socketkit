import cx from 'classnames'
import PropTypes from 'prop-types'

function Card({ title, className, children }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg px-4 py-5 border-b border-gray-200 sm:px-6">
      <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
        <div className="ml-4 mt-2">
          <h2 className="text-lg leading-6 font-bold text-gray-900">{title}</h2>
        </div>
      </div>

      <div className={cx('mt-4 text-sm whitespace-pre-wrap', className)}>{children}</div>
    </div>
  )
}

Card.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
}

export default Card

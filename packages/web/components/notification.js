import PropTypes from 'prop-types'

function Notification({ title, description }) {
  return (
    <div className="flex">
      <div className="w-0 flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
    </div>
  )
}

Notification.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
}

export default Notification

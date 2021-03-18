import PropTypes from 'prop-types'

function Badge({ title }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-warmGray-50 text-orange-500">
      {title}
    </span>
  )
}

Badge.propTypes = {
  title: PropTypes.string.isRequired,
}

export default Badge

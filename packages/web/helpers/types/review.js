import PropTypes from 'prop-types'

export const ReviewCursor = PropTypes.shape({
  review_id: PropTypes.string.isRequired,
  updated_at: PropTypes.string.isRequired,
})

export default PropTypes.shape({
  application_id: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  country_id: PropTypes.string.isRequired,
  review_id: PropTypes.string.isRequired,
  review_url: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  user_url: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  version_number: PropTypes.string.isRequired,
})

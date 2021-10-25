import PropTypes from 'prop-types'

export default PropTypes.shape({
  application_id: PropTypes.string.isRequired,
  bundle_id: PropTypes.string.isRequired,
  content_rating: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  developer_id: PropTypes.string.isRequired,
  developer_url: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  languages: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  ratings: PropTypes.arrayOf(PropTypes.number).isRequired,
  release_notes: PropTypes.string.isRequired,
  released_at: PropTypes.string.isRequired,
  required_os_version: PropTypes.string.isRequired,
  reviews: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
  screenhots: PropTypes.shape({
    default: PropTypes.arrayOf(PropTypes.string),
    ipad: PropTypes.arrayOf(PropTypes.string),
    appletv: PropTypes.arrayOf(PropTypes.string),
  }),
  size: PropTypes.string.isRequired,
  store_url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
})

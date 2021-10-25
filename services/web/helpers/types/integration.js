import PropTypes from 'prop-types'

export const Review = PropTypes.shape({
  application_icon: PropTypes.string.isRequired,
  application_id: PropTypes.string.isRequired,
  application_title: PropTypes.string.isRequired,
  country_ids: PropTypes.arrayOf(PropTypes.string).isRequired,
})

export const AppstoreConnect = PropTypes.shape({
  access_token: PropTypes.string.isRequired,
  failed_fetches: PropTypes.number.isRequired,
  last_fetch: PropTypes.string.isRequired,
  state: PropTypes.oneOf(['active', 'error']),
})

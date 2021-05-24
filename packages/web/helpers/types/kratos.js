import PropTypes from 'prop-types'

export default PropTypes.shape({
  active: PropTypes.oneOf(['link']),
  expires_at: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  issued_at: PropTypes.string.isRequired,
  request_url: PropTypes.string.isRequired,
  state: PropTypes.oneOf(['sent_email', 'choose_method']),
  type: PropTypes.oneOf(['browser']),
  ui: PropTypes.shape({
    action: PropTypes.string.isRequired,
    messages: PropTypes.arrayOf(
      PropTypes.shape({
        context: PropTypes.any,
        id: PropTypes.number.isRequired,
        text: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['info', 'error']).isRequired,
      }),
    ),
    method: PropTypes.oneOf(['POST']),
    nodes: PropTypes.arrayOf(
      PropTypes.shape({
        attributes: PropTypes.shape({
          disabled: PropTypes.bool,
          name: PropTypes.string.isRequired,
          required: PropTypes.bool,
          type: PropTypes.string.isRequired,
          value: PropTypes.string,
        }).isRequired,
        group: PropTypes.oneOf(['default', 'link', 'oidc', 'password']).isRequired,
        messages: PropTypes.arrayOf(PropTypes.shape(PropTypes.any)),
        meta: PropTypes.any,
        type: PropTypes.oneOf(['input']).isRequired,
      }),
    ).isRequired,
  }).isRequired,
}).isRequired

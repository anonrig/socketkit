import PropTypes from 'prop-types'

function SetupIntegration({ integration_id }) {
  const type = integration_id === 'email' ? 'email' : 'text'
  const placeholder =
    integration_id === 'email' ? 'Please enter your email' : 'Please enter your Webhook URL'

  return (
    <div className="flex rounded-md shadow-sm">
      <input
        className={
          'appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm'
        }
        required={true}
        name="preferences"
        type={type}
        placeholder={placeholder}
      />
    </div>
  )
}

SetupIntegration.propTypes = {
  integration_id: PropTypes.string,
}

export default SetupIntegration

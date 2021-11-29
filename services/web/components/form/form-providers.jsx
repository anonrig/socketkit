import Github from 'components/providers/github'
import Gitlab from 'components/providers/gitlab'
import PropTypes from 'prop-types'

function FormProviders({ action, oidc_group, method }) {
  return (
    <form action={action} method={method} id="oidc">
      <p className="text-sm font-medium text-gray-700">Sign in with</p>

      <div className="mt-1 grid grid-cols-3 gap-3">
        {oidc_group.map((field) => (
          <button
            name={field.attributes.name}
            value={field.attributes.value}
            type={field.attributes.type}
            key={field.attributes.value}
            className={
              'w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'
            }
          >
            <span className="sr-only">Sign in with {field.attributes.value}</span>
            {field.attributes.value === 'github' ? <Github /> : <Gitlab />}
          </button>
        ))}
      </div>
      <div className="mt-6 relative mb-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-warmGray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-trueGray-500">Or continue with</span>
        </div>
      </div>
    </form>
  )
}

FormProviders.propTypes = {
  action: PropTypes.string.isRequired,
  method: PropTypes.string.isRequired,
  oidc_group: PropTypes.any.isRequired,
}

export default FormProviders

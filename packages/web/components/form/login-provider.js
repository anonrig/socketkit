import PropTypes from 'prop-types'
import cx from 'classnames'

function LoginProviderForm({ action, method, fields }) {
  const gitlab = () => (
    <svg
      fill="currentColor"
      aria-hidden="true"
      className="w-5 h-5"
      viewBox="0 0 24 24"
    >
      <path
        d="M4.845.904c-.435 0-.82.28-.955.692C2.639 5.449 1.246 9.728.07 13.335a1.437 1.437 0 0 0 .522 1.607l11.071 8.045c.2.145.472.144.67-.004l11.073-8.04a1.436 1.436 0 0 0 .522-1.61c-1.285-3.942-2.683-8.256-3.817-11.746a1.004 1.004 0 0 0-.957-.684a.987.987 0 0 0-.949.69L15.8 9.001H8.203l-2.41-7.408a.987.987 0 0 0-.942-.69h-.006zm-.006 1.42l2.173 6.678H2.675zm14.326 0l2.168 6.678h-4.341zm-10.593 7.81h6.862c-1.142 3.52-2.288 7.04-3.434 10.559L8.572 10.135zm-5.514.005h4.321l3.086 9.5zm13.567 0h4.325c-2.467 3.17-4.95 6.328-7.411 9.502c1.028-3.167 2.059-6.334 3.086-9.502zM2.1 10.762l6.977 8.947l-7.817-5.682a.305.305 0 0 1-.112-.341zm19.798 0l.952 2.922a.305.305 0 0 1-.11.341v.002l-7.82 5.68l.026-.035z"
        fill="#626262"
      />
    </svg>
  )

  const github = () => (
    <svg
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
        clipRule="evenodd"
      />
    </svg>
  )

  const renderButton = (field) => (
    <button
      value={field.value}
      key={`${field.name}-${field.value}`}
      type={field.type}
      name={field.name}
      hidden={field.type === 'hidden'}
      className={cx({
        'w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50':
          field.name === 'provider',
      })}
    >
      <span className="sr-only">Sign in with GitHub</span>
      {field.value == 'github' ? github() : gitlab()}
    </button>
  )
  return (
    <form action={action} method={method}>
      <p className="text-sm font-medium text-gray-700">Sign in with</p>

      <div className="mt-1 grid grid-cols-3 gap-3">
        {fields?.map((field) =>
          field.name === 'provider' ? (
            renderButton(field)
          ) : (
            <input
              key={`${field.name}-${field.value}`}
              type={field.type}
              name={field.name}
              hidden={field.type === 'hidden'}
              defaultValue={field.value}
            />
          ),
        )}
      </div>
    </form>
  )
}

LoginProviderForm.propTypes = {
  action: PropTypes.string,
  method: PropTypes.string,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      required: PropTypes.bool,
      type: PropTypes.string.isRequired,
      value: PropTypes.string,
    }),
  ),
}
export default LoginProviderForm
export const providers = {
  gitlab: {
    label: 'Gitlab',
  },
  github: {
    label: 'Github',
  },
}

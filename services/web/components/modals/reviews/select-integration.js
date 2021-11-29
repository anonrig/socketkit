import cx from 'classnames'
import Image from 'next/image'
import PropTypes from 'prop-types'

export const integrations = [
  {
    description: 'Send messages to your Slack chat rooms',
    id: 'slack',
    imageUrl: '/icons/slack.svg',
    name: 'Slack',
  },
  {
    description: 'Send messages to your Discord channel',
    id: 'discord',
    imageUrl: '/icons/discord.svg',
    name: 'Discord',
  },
  {
    description: 'Receive an instant email',
    id: 'mail',
    imageUrl: '/icons/mail.svg',
    name: 'Mail',
  },
]

function SelectIntegration({ integration, setIntegration }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
      {integrations.map((i) => (
        <button
          key={i.id}
          onClick={() => setIntegration(i.id)}
          className={cx(
            'focus:outline-none relative rounded-lg border text-left px-5 py-3 shadow-sm flex items-center space-x-3 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500',
            i.id === integration
              ? 'border-orange-500 bg-orange-500'
              : 'border-gray-300 bg-white hover:border-gray-400',
          )}
        >
          <Image src={i.imageUrl} alt={i.name} width={52} height={52} />
          <div className="flex-1 min-w-0">
            <p
              className={cx(
                'text-sm font-semibold',
                i.id === integration ? 'text-white' : 'text-gray-900',
              )}
            >
              {i.name}
            </p>
            <p
              className={cx(
                'text-sm truncate',
                i.id === integration ? 'text-gray-100' : 'text-gray-500',
              )}
            >
              {i.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  )
}

SelectIntegration.propTypes = {
  integration: PropTypes.shape(PropTypes.any),
  setIntegration: PropTypes.func,
}

export default SelectIntegration

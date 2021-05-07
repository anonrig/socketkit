import Image from 'next/image'
import cx from 'classnames'

export const integrations = [
  {
    id: 'slack',
    name: 'Slack',
    description: 'Send messages to your Slack chat rooms',
    imageUrl: '/icons/slack.svg',
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Send messages to your Discord channel',
    imageUrl: '/icons/discord.svg',
  },
  {
    id: 'mail',
    name: 'Mail',
    description: 'Receive an instant email',
    imageUrl: '/icons/mail.svg',
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
          )}>
          <Image src={i.imageUrl} alt={i.name} width={52} height={52} />
          <div className="flex-1 min-w-0">
            <p
              className={cx(
                'text-sm font-semibold',
                i.id === integration ? 'text-white' : 'text-gray-900',
              )}>
              {i.name}
            </p>
            <p
              className={cx(
                'text-sm truncate',
                i.id === integration ? 'text-gray-100' : 'text-gray-500',
              )}>
              {i.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  )
}

export default SelectIntegration

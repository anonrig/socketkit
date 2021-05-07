import cx from 'classnames'
import Heading from 'components/heading'
import { CheckIcon, DeviceMobileIcon } from '@heroicons/react/outline'
import { Dialog } from '@headlessui/react'

const steps = [
  {
    name: 'application',
    order: 0,
    title: 'Select an application',
    subtitle: `Easily track your application's reviews from AppStore`,
  },
  {
    name: 'country',
    order: 1,
    title: 'Select countries',
    subtitle: `Which countries do you want to receive notifications from?`,
  },
  {
    name: 'integration',
    order: 2,
    title: 'Select an integration',
    subtitle: `How do you want to get notified?`,
  },
  {
    name: 'setup_integration',
    order: 2,
    title: 'Setup integration',
    subtitle: `Complete your integration setup in order to get notified`,
  },
]

function Steps({ current = 'application' }) {
  const existingStep = steps.find((s) => s.name === current)

  return (
    <nav className="text-center">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
        <DeviceMobileIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
      </div>
      <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900 mb-1 mt-3">
        {existingStep?.title}
      </Dialog.Title>
      <p className="text-sm text-gray-500">{existingStep?.subtitle}</p>
    </nav>
  )
}

export default Steps

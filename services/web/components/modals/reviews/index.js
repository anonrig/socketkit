import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'

import toast from 'react-hot-toast'

import Steps from './steps.js'
import SelectApplication from './select-application.js'
import SelectCountry from './select-country.js'
import SelectIntegration from './select-integration.js'
import SetupIntegration from './setup-integration.js'

function ReviewTrackingModal() {
  const [step, setStep] = useState('application')
  const [application, setApplication] = useState()
  const [countries, setCountries] = useState()
  const [integration, setIntegration] = useState()
  const [open, setOpen] = useState(true)

  const continueToNext = () => {
    switch (step) {
      case 'application':
        if (application) {
          setStep('country')
        } else {
          toast.error('Please select an application')
        }
        break
      case 'country':
        if (countries?.length > 0) {
          setStep('integration')
        } else {
          toast.error('Please select the countries to track')
        }
        break
      case 'integration':
        if (!integration) {
          // automatically create
        } else {
          setStep('setup_integration')
        }
        break
      case 'setup_integration':
        break
    }
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        open={open}
        onClose={setOpen}>
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <Steps current={step} />
                  <div className="my-6">
                    {step === 'application' && (
                      <SelectApplication
                        application={application}
                        setApplication={setApplication}
                      />
                    )}
                    {step === 'country' && (
                      <SelectCountry countries={countries} setCountries={setCountries} />
                    )}
                    {step === 'integration' && (
                      <SelectIntegration
                        integration={integration}
                        setIntegration={setIntegration}
                      />
                    )}
                    {step === 'setup_integration' && <SetupIntegration integration={integration} />}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md shadow-sm px-4 py-2 bg-orange-500 text-base font-medium text-white hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => continueToNext()}>
                  {step === 'setup_integration'
                    ? 'Create'
                    : step === 'integration' && !integration
                    ? 'Skip'
                    : 'Continue'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default ReviewTrackingModal

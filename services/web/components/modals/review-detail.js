import PropTypes from 'prop-types'
import { Fragment, useRef } from 'react'
import dayjs from 'dayjs'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationIcon, BadgeCheckIcon } from '@heroicons/react/outline'

import InlineRating from 'components/inline-rating'
import ReviewType from 'helpers/types/review'

function ReviewDetailModal({ onClose, review }) {
  const viewButtonRef = useRef(null)
  const ScoreIcon = (review?.score ?? 1) > 3 ? BadgeCheckIcon : ExclamationIcon
  const severity =
    review?.score == 1 ? 'text-red-600' : review?.score <= 3 ? 'text-yellow-500' : 'text-green-500'
  const backgroundSeverity =
    review?.score == 1 ? 'bg-red-100' : review?.score <= 3 ? 'bg-yellow-100' : 'bg-green-100'

  return (
    <Transition.Root appear={true} show={true} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-20 inset-0 overflow-y-auto"
        open={true}
        onClose={onClose}
        initialFocus={viewButtonRef}>
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
                <div className="sm:flex sm:items-start">
                  <div
                    className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${backgroundSeverity}`}>
                    <ScoreIcon className={`h-6 w-6 ${severity}`} aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <Dialog.Title
                      as="div"
                      className="text-lg leading-6 font-medium text-trueGray-900 inline-flex place-content-between w-full items-center">
                      {review?.title ?? ' '} <InlineRating rating={review?.score ?? 1} />
                    </Dialog.Title>
                    <div className="mt-2 text-sm text-warmGray-500">{review?.content ?? ' '}</div>
                    <div className="mt-4 text-sm text-warmGray-500">
                      Written by{' '}
                      <a
                        href={review?.user_url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium hover:text-orange-400 underline">
                        {review?.username ?? 'Apple User'}
                      </a>{' '}
                      on {dayjs(review?.updated_at).format('YYYY/MM/DD')}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <a
                  href={review?.review_url}
                  target="_blank"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  ref={viewButtonRef}
                  rel="noreferrer">
                  View on AppStore
                </a>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

ReviewDetailModal.defaultProps = {
  onClose: () => ({}),
}

ReviewDetailModal.propTypes = {
  onClose: PropTypes.func,
  review: ReviewType.isRequired,
}

export default ReviewDetailModal

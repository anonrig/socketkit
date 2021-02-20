import { Slide, ToastContainer } from 'react-toastify'

import CloseIcon from '../styles/icons/close-icon'

export default function ToastManager() {
  return (
    <ToastContainer
      autoClose={1000}
      bodyClassName={() => 'flex-1'}
      className="z-10 inset-0 fixed items-end flex justify-start px-4 py-6 sm:p-6 pointer-events-none flex-col sm:flex-1"
      closeButton={({ closeToast }) => (
        <button
          className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={closeToast}>
          <span className="sr-only">Close</span>
          <CloseIcon />
        </button>
      )}
      containerId="notifications"
      position="top-right"
      toastClassName={() =>
        'mb-4 p-4 flex max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden'
      }
      transition={Slide}
      hideProgressBar
    />
  )
}

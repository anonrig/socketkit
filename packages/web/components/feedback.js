import PropTypes from 'prop-types'
import Link from 'next/link'

function Feedback({ title, message, link }) {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
      <div className="flex max-w-7xl mx-auto px-2 sm:px-4 lg:divide-gray-200 lg:px-8">
        <div className="flex-shrink-0">
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path
              clipRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              fillRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            {title}
            <Link href={link}>
              <a className="font-medium underline text-yellow-700 hover:text-yellow-600">
                {message}
              </a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

Feedback.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
}

export default Feedback

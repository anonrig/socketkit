import PropTypes from 'prop-types'
import Link from 'next/link'
import cx from 'classnames'
import dayjs from 'dayjs'

function IntegrationRow({ title, slug, integration, className }) {
  return (
    <div
      className={cx('rounded-md bg-gray-50 px-6 py-5 flex items-start justify-between', className)}>
      <h4 className="sr-only">{title}</h4>
      <div className="flex items-start">
        <svg
          aria-hidden="true"
          className="h-6 mt-1 mb-1 w-auto flex-shrink-0 sm:h-6"
          focusable="false"
          height="1em"
          preserveAspectRatio="xMidYMid meet"
          style={{
            msTransform: 'rotate(360deg)',
            WebkitTransform: 'rotate(360deg)',
            transform: 'rotate(360deg)',
          }}
          viewBox="0 0 256 315"
          width="0.82em">
          <path
            d="M213.803 167.03c.442 47.58 41.74 63.413 42.197 63.615c-.35 1.116-6.599 22.563-21.757 44.716c-13.104 19.153-26.705 38.235-48.13 38.63c-21.05.388-27.82-12.483-51.888-12.483c-24.061 0-31.582 12.088-51.51 12.871c-20.68.783-36.428-20.71-49.64-39.793c-27-39.033-47.633-110.3-19.928-158.406c13.763-23.89 38.36-39.017 65.056-39.405c20.307-.387 39.475 13.662 51.889 13.662c12.406 0 35.699-16.895 60.186-14.414c10.25.427 39.026 4.14 57.503 31.186c-1.49.923-34.335 20.044-33.978 59.822M174.24 50.199c10.98-13.29 18.369-31.79 16.353-50.199c-15.826.636-34.962 10.546-46.314 23.828c-10.173 11.763-19.082 30.589-16.678 48.633c17.64 1.365 35.66-8.964 46.64-22.262"
            fill="#000"
          />
        </svg>
        <div className="mt-0 ml-4">
          <div className="text-sm font-medium text-gray-900">{title}</div>
          <div className="mt-1 text-sm text-gray-600 flex items-center">
            <div className="sm:mt-1 mt-0">
              {integration !== null
                ? `Last fetched at ${dayjs(integration.last_fetch).format(
                    'DD-MM-YYYY',
                  )}. Current status: ${integration.state}`
                : `Integration not active`}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 sm:mt-0 sm:ml-6 sm:flex-shrink-0">
        <Link href={`/account/integrations/${slug}`}>
          <a className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            {integration !== null ? 'Update' : 'Add'}
          </a>
        </Link>
      </div>
    </div>
  )
}

IntegrationRow.propTypes = {
  integration: PropTypes.shape({
    last_fetch: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
  }),
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  className: PropTypes.string,
}

export default IntegrationRow

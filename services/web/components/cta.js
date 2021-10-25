import PropTypes from 'prop-types'
import Link from 'next/link'

function CTA({ title, subtitle, primaryButton, secondaryButton }) {
  return (
    <div className="flex justify-between items-start lg:items-center lg:justify-between shadow-lgs px-6 py-5 rounded-md">
      <h2 className="text-xl font-extrabold tracking-tight text-warmGray-900">
        <span className="block">{title}</span>
        {subtitle && (
          <span className="block text-trueGray-500 text-lg font-semibold">{subtitle}</span>
        )}
      </h2>
      <div className="sm:mt-0 mt-8 flex lg:mt-0 lg:flex-shrink-0">
        {!!secondaryButton && (
          <div className="inline-flex rounded-md shadow">
            <Link href={secondaryButton.href}>
              <a className="inline-flex items-center justify-center px-5 py-3 text-base font-medium rounded-md text-orange-500 bg-white hover:text-orange-400">
                {secondaryButton.title}
              </a>
            </Link>
          </div>
        )}

        <div className="ml-4 inline-flex rounded-md shadow">
          <Link href={primaryButton.href}>
            <a className="inline-flex items-center justify-center px-5 py-3 text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-400">
              {primaryButton.title}
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}

CTA.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  primaryButton: PropTypes.shape({
    title: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
  }).isRequired,
  secondaryButton: PropTypes.shape({
    title: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
  }),
}

export default CTA

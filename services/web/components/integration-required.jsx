import { useRouter } from 'next/router'
import PropTypes from 'prop-types'

function IntegrationRequired({ title, subtitle, url }) {
  const router = useRouter()

  return (
    <>
      <div className="mb-48">
        <h2 className="text-xl font-extrabold tracking-tight sm:text-4xl my-4 mb-8">{title}</h2>
        <p className="text-xl text-stone-500 mb-4">{subtitle}</p>
        <button
          onClick={() => router.push(url)}
          className={
            'flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 w-44'
          }
        >
          Start Tracking
        </button>
      </div>
    </>
  )
}

IntegrationRequired.propTypes = {
  subtitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
}

export default IntegrationRequired

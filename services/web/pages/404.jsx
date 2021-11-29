import Link from 'next/link'

function Custom404() {
  return (
    <div className="bg-white min-h-screen px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="max-w-max mx-auto">
        <main className="sm:flex">
          <p className="text-4xl font-extrabold text-orange-600 sm:text-5xl">404</p>
          <div className="sm:ml-6">
            <div className="sm:border-l sm:border-gray-200 sm:pl-6">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                Page not found
              </h1>
              <p className="mt-1 text-base text-gray-500">
                Please check the URL in the address bar and try again.
              </p>
            </div>
            <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
              <Link href="/">
                <a className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                  Go back home
                </a>
              </Link>
              <button
                onClick={() => console.error('Implement this.')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-orange-500 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Contact support
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

Custom404.propTypes = {}

export default Custom404

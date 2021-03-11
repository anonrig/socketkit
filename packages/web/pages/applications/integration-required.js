import Link from 'next/link'

export default function IntegrationRequired() {
  return (
    <div className="mb-48">
      <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl my-4 mb-8">
        Integration required
      </h2>
      <p className="text-xl text-warmGray-500 mb-4">
        You need to add an integration to access your Applications list.
      </p>
      <Link href={'/account/integrations'}>
        <a
          className={
            'transition ease-in-out duration-150 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 w-44'
          }>
          Add an Integration
        </a>
      </Link>
    </div>
  )
}

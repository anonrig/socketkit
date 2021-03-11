import Link from 'next/link'

export default function IntegrationRequired() {
  return (
    <>
      <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl my-4">
        Integration required
      </h2>
      <p className="text-xl text-warmGray-500">
        You need to add an integration to access your Applications list.
      </p>
      <p className="text-xl text-warmGray-500">
        Please follow
        <Link href="/account/integrations">
          <a className="font-semibold text-orange-500"> this link </a>
        </Link>
        to add an integration.
      </p>
    </>
  )
}

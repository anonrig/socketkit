import { useRouter } from 'next/router'
import logo from '../images/socketkit.svg'
import pkg from '../package.json'
export default function Failed() {
  const { query } = useRouter()
  
  return (
    <>
      <div className="mb-8">
        <img alt="Socketkit, Inc." className="h-12 w-auto" src={logo} />
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Error (v{pkg.version})
        </h2>
        <p className="mt-2 text-sm text-gray-600 max-w">
          We're working really hard to fix this issue.
        </p>
      </div>
      <code>
        {JSON.stringify(query, null, 2)}
      </code>
    </>
  )
}
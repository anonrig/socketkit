import { useRouter } from 'next/router'
import pkg from '../package.json'

export default function Failed() {
  const { query } = useRouter()

  return (
    <>
      <h2 className="text-3xl font-extrabold text-gray-900">Error (v{pkg.version})</h2>
      <p className="mt-2 text-sm text-gray-600 max-w">
        We're working really hard to fix this issue.
      </p>
      <code className="mt-8">{JSON.stringify(query, null, 2)}</code>
    </>
  )
}

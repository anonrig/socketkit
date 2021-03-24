import PropTypes from 'prop-types'
import Button from 'components/form/button.js'
import { fetcher } from 'helpers/fetcher.js'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import useSWR, { mutate } from 'swr'

export async function getServerSideProps({
  query: { slug },
  req: {
    headers: { cookie, referer },
  },
}) {
  const integrations = await fetcher(`integrations/${slug}`, {
    headers: { cookie, referer },
  })

  return {
    props: {
      integrations,
    },
  }
}

function IntegrationDetail({ integrations }) {
  const router = useRouter()
  const { slug } = router.query
  const [loading, setLoading] = useState(false)
  const { handleSubmit, register } = useForm()
  const { data } = useSWR(`integrations/${slug}`, fetcher, { initialData: integrations })

  async function onSubmit(values, _, isDeleted = false) {
    setLoading(true)

    try {
      await fetcher(`integrations/${slug}`, {
        method: isDeleted ? 'DELETE' : 'PUT',
        body: JSON.stringify({
          requirement_payload: values,
        }),
      })
      mutate(`integrations`)
      if (isDeleted) {
        toast.success('Integration deleted successfully.')
      } else {
        toast.success('Integration updated successfully.')
      }
      router.replace('/account/integrations')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section aria-labelledby="integration_details_heading">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="shadow sm:rounded-md sm:overflow-hidden">
          <div className="bg-white py-6 px-4 sm:p-6">
            <div>
              <h2
                className="text-lg leading-6 font-medium text-warmGray-900"
                id="payment_details_heading">
                {data?.title ?? 'Integration'}
              </h2>
              <p className="mt-1 text-sm text-trueGray-500">
                Learn how to get your access token from{' '}
                <a
                  className="inline underline text-orange-500 text-sm font-semibold"
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.socketkit.com/blog/guides/how-to-integrate-appstore-connect">
                  our guide
                </a>
                .
              </p>
            </div>
            <div className="mt-6 grid grid-cols-4 gap-6">
              {Object.keys(data?.requirement_schema.properties ?? {}).map((key) => (
                <div className="col-span-4 text-warmGray-900" key={key}>
                  <label className="block text-sm font-medium" htmlFor={key}>
                    {data?.requirement_schema.properties[key]?.label ?? key}
                  </label>
                  <input
                    ref={register({ required: true })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-warmGray-900 focus:border-warmGray-900 sm:text-sm"
                    defaultValue={(data?.integration ?? {})[key] || ''}
                    name={key}
                    type="text"
                    required
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="px-4 py-3 sm:px-6 space-x-2 border-t border-gray-200 flex justify-between">
            {data?.integration ? (
              <Button
                onClick={() => onSubmit(null, null, true)}
                className="text-orange-500 py-2 inline-flex justify-center text-sm font-semibold  hover:text-orange-400"
                loading={false}>
                Delete & Disable Integration
              </Button>
            ) : null}

            <div className="space-x-4">
              <Button
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                loading={loading}
                onClick={() => router.push('/account/integrations')}>
                Cancel
              </Button>

              <Button
                className="bg-orange-500 rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warmGray-900"
                loading={loading}
                type="submit">
                {data?.integration ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </section>
  )
}

IntegrationDetail.propTypes = {
  integrations: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      requirement_schema: PropTypes.any,
      integration: PropTypes.any,
    }),
  ),
}

export default IntegrationDetail

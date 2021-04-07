import PropTypes from 'prop-types'
import Button from 'components/form/button.js'
import { fetcher } from 'helpers/fetcher.js'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import useSWR, { mutate } from 'swr'

export async function getServerSideProps({
  req: {
    headers: { cookie, referer },
  },
}) {
  const initialData = await fetcher(`integrations/appstore-connect`, {
    headers: { cookie, referer },
  })

  return {
    props: {
      initialData,
    },
  }
}

function AppStoreConnectIntegration({ initialData }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { handleSubmit, register } = useForm()
  const { data } = useSWR(`integrations/appstore-connect`, fetcher, { initialData })

  async function onSubmit(values, _, isDeleted = false) {
    setLoading(true)

    try {
      await fetcher(`integrations/appstore-connect`, {
        method: isDeleted ? 'DELETE' : 'PUT',
        body: JSON.stringify({
          requirement_payload: values,
        }),
      })
      mutate(`integrations/appstore-connect`)
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
              <h2 className="text-lg leading-6 font-medium text-warmGray-900">
                Subscription Tracking - AppStore Connect
              </h2>
              <p className="mt-1 text-sm text-trueGray-500">
                In order to use AppStore Connect integration, you need to copy your reporter token
                from{' '}
                <a
                  className="inline underline text-orange-500 text-sm font-semibold"
                  target="_blank"
                  rel="noreferrer"
                  href="https://socketkit.com/blog/guides/how-to-integrate-appstore-connect">
                  AppStore Connect
                </a>
                .
              </p>
              <p className="mt-1 text-sm text-trueGray-500">
                Make sure it is an active developer account with sales and subscriptions.
              </p>
            </div>
            <div className="text-warmGray-900 mt-6 flex flex-1 flex-col mt-6">
              <label className="block text-sm font-medium" htmlFor={'access_token'}>
                Reporter Token
              </label>
              <input
                {...register('access_token', { required: true })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-warmGray-900 focus:border-warmGray-900 sm:text-sm"
                defaultValue={data?.access_token || ''}
                name={'access_token'}
                type="text"
                required
              />
            </div>
          </div>
          <div className="px-4 py-3 sm:px-6 space-x-2 border-t border-gray-200 flex justify-between">
            {data?.access_token ? (
              <Button
                onClick={() => onSubmit(null, null, true)}
                className="text-orange-500 py-2 inline-flex justify-center text-sm font-semibold  hover:text-orange-400">
                Delete & Disable Integration
              </Button>
            ) : (
              <div></div>
            )}

            <div className="space-x-4">
              <Button
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                disabled={loading}
                onClick={() => router.push('/account/integrations')}>
                Cancel
              </Button>

              <Button
                className="bg-orange-500 rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warmGray-900"
                disabled={loading}
                type="submit">
                {data?.access_token ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </section>
  )
}

AppStoreConnectIntegration.propTypes = {
  integrations: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      requirement_schema: PropTypes.any,
      integration: PropTypes.any,
    }),
  ),
}

export default AppStoreConnectIntegration

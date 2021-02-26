import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import useSWR, { mutate } from 'swr'

import Button from 'components/form/button.js'
import { useRouter } from 'next/router'
import { fetcher } from 'helpers/fetcher.js'

export default function IntegrationDetail() {
  const router = useRouter()
  const { slug } = router.query
  const [loading, setLoading] = useState(false)
  const { handleSubmit, register } = useForm()
  const { data } = useSWR(`integrations/${slug}`)

  async function onSubmit(values, event, isDeleted = false) {
    setLoading(true)

    try {
      await fetcher(`integrations/${slug}`, {
        method: isDeleted ? 'DELETE' : 'PUT',
        body: JSON.stringify({
          requirement_payload: values,
        }),
      })
      mutate(`integrations`)
      toast.success('Integration updated successfully.')
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
                className="text-lg leading-6 font-medium text-gray-900"
                id="payment_details_heading">
                {data?.title ?? 'Integration'}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Update your integration settings. Learn more from{' '}
                <a
                  className="inline underline text-blueGray-800 text-sm font-medium"
                  href="https://help.chartmogul.com/hc/en-us/articles/360000109609">
                  our competitor
                </a>
                .
              </p>
            </div>
            <div className="mt-6 grid grid-cols-4 gap-6">
              {Object.keys(data?.requirement_schema.properties ?? {}).map((key) => (
                <div className="col-span-4" key={key}>
                  <label className="block text-sm font-medium text-gray-700" htmlFor={key}>
                    {data?.requirement_schema.properties[key]?.label ?? key}
                  </label>
                  <input
                    ref={register({ required: true })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                    defaultValue={(data?.integration && data?.integration[key]) || ''}
                    name={key}
                    type="text"
                    required
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 space-x-2">
            {data?.integration !== null ? (
              <Button
                onClick={() => onSubmit(null, null, true)}
                className="bg-red-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                loading={false}>
                Delete
              </Button>
            ) : null}

            <Button
              className="bg-gray-800 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              loading={loading}
              type="submit">
              {data?.integration !== null ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </form>
    </section>
  )
}

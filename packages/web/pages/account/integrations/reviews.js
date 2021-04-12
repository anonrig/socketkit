import PropTypes from 'prop-types'
import Button from 'components/form/button.js'
import { fetcher } from 'helpers/fetcher.js'
import { useRouter } from 'next/router'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { mutate } from 'swr'

import SearchField from 'components/form/search-field.js'
import CountryPicker from 'components/form/country-picker.js'

export async function getServerSideProps({
  req: {
    headers: { cookie, referer },
  },
}) {
  const initialData = await fetcher(`integrations/reviews`, {
    headers: { cookie, referer },
  })

  return {
    props: {
      initialData,
    },
  }
}

function ReviewsIntegration({ initialData }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [applications, setApplications] = useState(initialData.concat(null))

  async function onSubmit() {
    setLoading(true)

    try {
      await fetcher(`integrations/reviews`, {
        method: 'PUT',
        body: JSON.stringify({
          requirement_payload: applications.filter((a) => !!a),
        }),
      })
      setLoading(false)
      mutate(`integrations/reviews`)
      toast.success('Reviewed applications are updated')
      router.replace('/account/integrations')
    } catch (error) {
      setLoading(false)
      toast.error(error.message)
    }
  }

  const updateApplication = (index, application) => {
    const existing = applications.find((a) => a?.application_id === application?.application_id)
    let manipulated = applications.slice(0)
    if (application === null || !!existing) {
      // remove duplicates
      manipulated.splice(index, 1)
      if (manipulated[manipulated.length - 1] !== null) {
        manipulated.push(null)
      }
    } else {
      manipulated[index] = application
      if (index === manipulated.length - 1) {
        manipulated.push(null)
      }
    }

    setApplications(manipulated)
  }

  const updateCountry = (index, countries) => {
    let manipulated = applications.slice(0)
    manipulated[index].country_ids = countries
    setApplications(manipulated)
  }

  return (
    <section aria-labelledby="reviews_integration_heading">
      <div className="shadow sm:rounded-md">
        <div className="bg-white py-6 px-4 sm:p-6">
          <div>
            <h2 className="text-lg leading-6 font-medium text-warmGray-900">
              Review Tracking - AppStore Connect
            </h2>
            <p className="mt-1 text-sm text-trueGray-500">
              Easily track the reviews of your applications on AppStore for better customer feedback
              and higher ratings.
            </p>
          </div>
          <div className="mt-6 grid grid-cols-4 gap-6">
            <div className="sm:col-span-4">
              <label htmlFor="city" className="block text-sm font-medium text-warmGray-700">
                Application
              </label>
              <div className="mt-1 space-y-4">
                {applications.map((application, index) => (
                  <div
                    className="flex flex-row flex-1 space-x-4"
                    key={application?.application_id ?? 'new-application'}>
                    <div className="flex-1">
                      <SearchField
                        placeholder="Type your application name or id"
                        value={application}
                        onValueChange={(a) => updateApplication(index, a)}
                      />
                    </div>
                    <div className="">
                      <CountryPicker
                        selected={application?.country_ids ?? []}
                        setSelected={(values) => updateCountry(index, values)}
                        disabled={!!!application}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 sm:px-6 space-x-2 border-t border-gray-200 flex justify-between">
          <div></div>

          <div className="space-x-4">
            <Button
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-warmGray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              disabled={loading}
              onClick={() => router.push('/account/integrations')}>
              Cancel
            </Button>

            <Button
              className="bg-orange-500 rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warmGray-900"
              disabled={loading}
              type="button"
              onClick={() => onSubmit()}>
              {initialData?.length > 0 ? 'Update' : 'Add Applications'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

ReviewsIntegration.propTypes = {
  integrations: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      requirement_schema: PropTypes.any,
      integration: PropTypes.any,
    }),
  ),
}

export default ReviewsIntegration

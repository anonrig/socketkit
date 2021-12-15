import cx from 'classnames'
import Button from 'components/form/button'
import Loading from 'components/loading'
import { fetcher } from 'helpers/fetcher'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { mutate } from 'swr'

function ApplicationTrackingForm({ isCreating, fallbackData, application_id }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      application_id,
      session_timeout: fallbackData?.session_timeout ?? 30,
      title: fallbackData?.title ?? '',
    },
  })

  const getField = (field, name, inputProps = {}) => (
    <fieldset className="flex-1">
      <label className={'block text-sm font-medium text-gray-700'} htmlFor={field}>
        {name}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          autoComplete="on"
          className={cx(
            'appearance-none block w-full px-3 py-2 border border-stone-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm',
            {
              'border-red-500 placeholder-red-500': errors[field.toString()],
            },
          )}
          required={true}
          type={'text'}
          {...register(field, { required: true })}
          {...inputProps}
        />
      </div>
    </fieldset>
  )

  const onSubmit = async (data) => {
    const url = isCreating ? 'integrations/tracking' : `integrations/tracking/${application_id}`
    setLoading(true)

    try {
      await fetcher(url, {
        body: JSON.stringify(data),
        method: isCreating ? 'POST' : 'PUT',
      })
      mutate('integrations/tracking')
      toast.success(isCreating ? 'Application is created' : 'Application is updated')
      router.replace('/products/application-tracking')
    } catch (error) {
      toast.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="shadow sm:rounded-md sm:overflow-hidden" onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-white py-6 px-4 sm:p-6 space-y-2">
        <div className="space-y-4">
          {getField('title', 'Application Title', {
            placeholder: 'Title of your application. Only visible internally.',
            type: 'text',
          })}

          <div className="flex flex-1 space-between space-y-4 md:space-y-0 md:space-x-4 flex-col md:flex-row">
            {getField('application_id', 'Bundle Id', {
              placeholder: 'Application bundle identifier. Example: com.facebook.app',
              type: 'text',
            })}

            {getField('session_timeout', 'Session Timeout (seconds)', {
              max: 3600,
              min: 30,
              type: 'number',
            })}
          </div>
        </div>
      </div>

      <div className="px-4 py-3 text-right sm:px-6 border-t border-gray-200 flex flex-col items-end">
        <Button type="submit">
          <span className={cx([loading ? 'opacity-0' : null])}>
            {isCreating ? 'Save & Create' : 'Update'}
          </span>
          {loading && (
            <Loading className="absolute inset-0 flex flex-1 items-center justify-center" />
          )}
        </Button>
      </div>
    </form>
  )
}

ApplicationTrackingForm.propTypes = {
  application_id: PropTypes.string.isRequired,
  fallbackData: PropTypes.shape({
    application_id: PropTypes.string.isRequired,
    session_timeout: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
  isCreating: PropTypes.bool.isRequired,
}

export default ApplicationTrackingForm

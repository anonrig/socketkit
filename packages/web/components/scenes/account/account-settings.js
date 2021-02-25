import PropTypes from 'prop-types'
import FormField from 'components/form/field'
import Button from 'components/form/button'

function Settings({ fields }) {
  return (
    <section aria-labelledby="account_details_heading">
      <div className="shadow sm:rounded-md sm:overflow-hidden">
        <div className="bg-white py-6 px-4 sm:p-6">
          <div>
            <h2 className="text-lg leading-6 font-medium text-gray-900">Account details</h2>
            <p className="mt-1 text-sm text-gray-500">Update your account information.</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {fields
              .filter((f) => f.name !== 'traits.picture')
              .map((field) => (
                <FormField
                  key={field.name}
                  {...field}
                  className="col-span-2"
                  labelClassName="block text-sm font-medium text-gray-700"
                  inputClassName="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                />
              ))}
          </div>
        </div>
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <Button
            className="bg-gray-800 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            loading={false}
            type="submit">
            Save
          </Button>
        </div>
      </div>
    </section>
  )
}

Settings.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      required: PropTypes.bool,
      type: PropTypes.string.isRequired,
      value: PropTypes.string,
    }),
  ),
}

export default Settings

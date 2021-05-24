import PropTypes from 'prop-types'
import FormField from 'components/form/field'
import Button from 'components/form/button'
import { KratosNode } from 'helpers/types/kratos.js'

function AccountPassword({ fields }) {
  const submit = fields.find((f) => f.attributes.type === 'submit') ?? {}

  return (
    <section className="shadow sm:rounded-md sm:overflow-hidden">
      <div className="bg-white py-6 px-4 sm:p-6 space-y-4">
        <h2 className="text-lg leading-6 font-medium text-warmGray-900">Update Password</h2>
        {fields
          .filter((f) => f.attributes.name !== 'traits.picture' && f.attributes.type !== 'submit')
          .map((field) => (
            <FormField
              key={field.attributes.name}
              {...field.attributes}
              className="col-span-2"
              labelClassName="block text-sm font-medium text-warmGray-700"
              inputClassName="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
            />
          ))}
      </div>
      <div className="px-4 py-3 text-right sm:px-6 border-t border-gray-200">
        <Button
          className="bg-orange-500 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
          {...submit.attributes}>
          Update
        </Button>
      </div>
    </section>
  )
}

AccountPassword.propTypes = {
  fields: PropTypes.arrayOf(KratosNode).isRequired,
}

export default AccountPassword

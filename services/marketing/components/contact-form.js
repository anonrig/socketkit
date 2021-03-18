import { useForm, ValidationError } from '@formspree/react'

export default function ContactForm() {
  const [state, handleSubmit] = useForm('mrgonnkg')

  if (state.succeeded) {
    return (
      <p className="mt-4 text-lg text-trueGray-500 sm:mt-3 text-center">
        We'll get back to you as soon as possible!
      </p>
    )
  }

  return (
    <>
      <p className="mt-4 text-lg text-trueGray-500 sm:mt-3 text-center">
        We’d love to hear from you!<br></br>Send us a message using the form below, or email us.
      </p>
      <form
        onSubmit={handleSubmit}
        className="mt-9 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-trueGray-500">
            First name
            <input
              type="text"
              name="first_name"
              id="first_name"
              autoComplete="given-name"
              required={true}
              className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-orange-500 focus:border-orange-500 border-gray-300 rounded-md"
            />
          </label>
        </div>
        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-trueGray-500">
            Last name
            <input
              type="text"
              name="last_name"
              autoComplete="family-name"
              id="last_name"
              required={true}
              className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-orange-500 focus:border-orange-500 border-gray-300 rounded-md"
            />
          </label>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="email" className="block text-sm font-medium text-trueGray-500">
            Email
            <input
              name="email"
              type="email"
              autoComplete="email"
              required={true}
              className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-orange-500 focus:border-orange-500 border-gray-300 rounded-md"
            />
          </label>
        </div>
        <div className="sm:col-span-2">
          <div className="flex justify-between">
            <label
              htmlFor="how_can_we_help"
              className="block text-sm font-medium text-trueGray-500 w-full">
              How can we help you?
              <textarea
                id="how_can_we_help"
                name="how_can_we_help"
                required={true}
                aria-describedby="how_can_we_help_description"
                rows="4"
                className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-orange-500 focus:border-orange-500 border-gray-300 rounded-md"></textarea>
            </label>
          </div>
        </div>
        <ValidationError prefix="Message" field="message" errors={state.errors} />
        <div className="text-right sm:col-span-2">
          <button
            disabled={state.submitting}
            type="submit"
            className="inline-flex justify-center py-2 px-4 shadow-sm text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
            Submit
          </button>
        </div>
      </form>
    </>
  )
}

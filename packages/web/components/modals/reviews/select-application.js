import ApplicationPicker from 'components/form/application-picker.js'

function SelectApplication({ application = null, setApplication = () => ({}) }) {
  return (
    <div className="rounded-md shadow-sm">
      <ApplicationPicker
        value={application}
        onChange={(application) => setApplication(application)}
      />
    </div>
  )
}

export default SelectApplication

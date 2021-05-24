import PropTypes from 'prop-types'
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

SelectApplication.propTypes = {
  application: PropTypes.shape(PropTypes.any),
  setApplication: PropTypes.func,
}

export default SelectApplication

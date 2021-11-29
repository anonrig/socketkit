import ApplicationPicker from 'components/form/application-picker.js'
import PropTypes from 'prop-types'

function SelectApplication({ application, setApplication }) {
  return (
    <div className="rounded-md shadow-sm">
      <ApplicationPicker
        value={application}
        onChange={(application) => setApplication(application)}
      />
    </div>
  )
}

SelectApplication.defaultProps = {
  application: null,
  setApplication: () => ({}),
}

SelectApplication.propTypes = {
  application: PropTypes.any,
  setApplication: PropTypes.func,
}

export default SelectApplication

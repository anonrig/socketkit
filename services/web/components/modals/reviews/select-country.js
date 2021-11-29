import CountryPicker from 'components/form/country-picker.js'
import PropTypes from 'prop-types'

function SelectCountry({ countries, setCountries = () => ({}) }) {
  return (
    <div className="rounded-md shadow-sm">
      <CountryPicker
        value={countries ?? []}
        onChange={(values) => setCountries(values)}
        placeholder="Select countries"
        isMulti
      />
    </div>
  )
}

SelectCountry.propTypes = {
  countries: PropTypes.arrayOf(PropTypes.string),
  setCountries: PropTypes.func,
}

export default SelectCountry

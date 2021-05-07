import CountryPicker from 'components/form/country-picker.js'

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

export default SelectCountry

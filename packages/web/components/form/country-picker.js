import { forwardRef } from 'react'
import Select from 'react-select'
import countries from 'country-region-data'
import cx from 'classnames'

function CountryPicker({ className, onChange, value, ...props }, ref) {
  if (typeof value === 'string') {
    value = countries.find((c) => c.countryShortCode.toLowerCase() === value.toLowerCase())
  }

  return (
    <Select
      options={countries}
      getOptionLabel={(option) => {
        if (typeof option === 'object') return option.countryName
        return countries.find((c) => c.countryShortCode.toLowerCase() === option.toLowerCase())
          ?.countryName
      }}
      getOptionValue={(option) => option}
      className={cx('mt-1 sm:text-sm text-md', className)}
      ref={ref}
      onChange={(v) => onChange(v.countryShortCode?.toUpperCase())}
      value={value}
      theme={(theme) => ({
        ...theme,
        borderRadius: '0.375rem',
        colors: {
          ...theme.colors,
          primary25: '#FAFAF9',
          primary50: '#FAFAF9',
          primary25: '#F5F5F4',
          primary: 'rgba(249, 115, 22, 1)',
        },
      })}
      {...props}
    />
  )
}

export default forwardRef(CountryPicker)

import PropTypes from 'prop-types'

export default PropTypes.shape({
  application_id: PropTypes.string.isRequired,
  client_id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  properties: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
  session_started_at: PropTypes.string.isRequired,
  created_at: PropTypes.string.isRequired,
}).isRequired

export const EventCursor = PropTypes.shape({
  created_at: PropTypes.string.isRequired,
})

export const EventKeys = {
  application_id: 'Application',
  country_id: 'Country',
  device_locale: 'Locale',
  device_manufacturer: 'Manufacturer',
  device_platform: 'Platform',
  device_type: 'Type',
  device_height: 'Screen Height',
  device_width: 'Screen Width',
  os_name: 'Operating System',
  application_build_number: 'Build Number',
  application_version: 'Version',
  library_version: 'Library Version',
  created_at: 'Member Since',
  updated_at: 'Last Online At',
}

export const EventTitles = {
  first_app_open: 'First App Open',
  in_app_purchase: 'In-App Purchase',
  set_client: 'Client Update',
  custom: 'Custom Event',
}

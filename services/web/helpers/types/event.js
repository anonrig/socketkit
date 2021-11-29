import PropTypes from 'prop-types'

export default PropTypes.shape({
  application_id: PropTypes.string.isRequired,
  client_id: PropTypes.string.isRequired,
  created_at: PropTypes.string.isRequired,
  properties: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
  session_started_at: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}).isRequired

export const EventCursor = PropTypes.shape({
  created_at: PropTypes.string.isRequired,
})

export const EventKeys = {
  application_build_number: 'Build Number',
  application_id: 'Application',
  application_version: 'Version',
  country_id: 'Country',
  created_at: 'Member Since',
  device_height: 'Screen Height',
  device_locale: 'Locale',
  device_manufacturer: 'Manufacturer',
  device_platform: 'Platform',
  device_type: 'Type',
  device_width: 'Screen Width',
  library_version: 'Library Version',
  os_name: 'Operating System',
  updated_at: 'Last Online At',
}

export const EventTitles = {
  custom: 'Custom Event',
  first_app_open: 'First App Open',
  in_app_purchase: 'In-App Purchase',
  set_client: 'Client Update',
}

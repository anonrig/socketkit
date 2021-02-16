import MultiColumnLayout from '../multi-column.js'
import ApplicationLeadingMenu from './application-leading.js'

export default function ApplicationLayout({ children, id }) {
  return (
    <MultiColumnLayout
      leading={<ApplicationLeadingMenu id={id} />}
      center={children}
    />
  )
}
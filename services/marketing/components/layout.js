import Header from '../components/header.js'
import Footer from '../components/footer.js'

export default function Layout({ children }) {
  return (
    <div className="bg-white">
      <Header />
      {children}
      <Footer />
    </div>
  )
}

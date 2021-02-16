import router from 'next/router'

export default function redirectTo(destination, { res, status } = {}) {
  if (res) {
    res.writeHead(302, { Location: destination })
    res.end()
  } else {
    if (destination[0] === '/' && destination[1] !== '/') {
      router.push(destination)
    } else {
      window.location = destination
    }
  }
}
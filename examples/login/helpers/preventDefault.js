export default function preventDefault(next) {
  return (e) => {
    e.preventDefault()
    next()
  }
}

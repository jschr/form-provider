export default function preventDefault(next) {
  return (e) => {
    next(e.target.value)
  }
}

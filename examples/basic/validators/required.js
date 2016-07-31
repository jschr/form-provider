export default function required(value) {
  return !!value || new Error('Required')
}

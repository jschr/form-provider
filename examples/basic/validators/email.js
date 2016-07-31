import { isEmail } from 'validator'

export default function email(value = '') {
  return isEmail(value) || new Error('Invalid email')
}

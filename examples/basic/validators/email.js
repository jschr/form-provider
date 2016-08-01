import { isEmail } from 'validator'

export default (value = '') => new Promise((resolve, reject) => {
  if (isEmail(value)) { resolve() }
  else { reject(new Error('Invalid Email')) }
})

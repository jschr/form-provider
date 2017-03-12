export const isRequired = (name) => (value) => new Promise((resolve, reject) => {
  if (!value) return reject(new Error(`${name} is required`))
  resolve()
})

export const isNotNumber = (name) => (value) => new Promise((resolve, reject) => {
  if (!isNaN(value)) return reject(new Error(`${name} is must not be a number`))
  resolve()
})

export default (value) => new Promise((resolve, reject) => {
  if (value) { resolve() }
  else { reject(new Error('Required')) }
})

import { PropTypes } from 'react'

export default PropTypes.shape({
  subscribe: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired,
  getFormState: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  addValidator: PropTypes.func.isRequired,
  removeValidator: PropTypes.func.isRequired,
  addSubmitListener: PropTypes.func.isRequired,
  removeSubmitListener: PropTypes.func.isRequired,
  validate: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  setValidationError: PropTypes.func.isRequired,
  clearValidationError: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  clear: PropTypes.func.isRequired,
  unsubscribe: PropTypes.func.isRequired
})

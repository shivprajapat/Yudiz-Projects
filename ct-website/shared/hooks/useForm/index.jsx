import { useState, useEffect, useRef } from 'react'

const useForm = (callback, validate) => {
  const [values, setValues] = useState({})
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fields = useRef({})

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      callback()
    }
  }, [errors])

  useEffect(() => {
    // fields.current.sLogin
  }, [fields])

  const handleSubmit = (event) => {
    if (event) event.preventDefault()
    setErrors(validate(values))
    setIsSubmitting(true)
  }

  const handleChange = (event) => {
    event.persist()
    setValues(values => ({ ...values, [event.target.name]: event.target.value }))
  }

  function register(name, options, onChange) {
    // onChange = (e) => {
    //   console.log('onChange', e)
    // }
    fields.current[name] = options
  }

  return {
    handleChange,
    handleSubmit,
    register,
    values,
    errors
  }
}

export default useForm

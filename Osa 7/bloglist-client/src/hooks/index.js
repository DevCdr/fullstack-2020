import { useState } from 'react'

export const useField = (type, name, id) => {
  const [value, setValue] = useState('')

  const onChange = ({ target }) => setValue(target.value)
  const autoComplete = 'on'
  const reset = () => setValue('')

  return { type, value, name, id, onChange, autoComplete, reset }
}
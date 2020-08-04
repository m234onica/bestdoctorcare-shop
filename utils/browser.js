export const encodeCollectionKey = s => encodeURIComponent(s)
export const decodeCollectionKey = s => decodeURIComponent(s)

export const submitForm = ({ method = 'POST', action, values }) => {
  const form = document.createElement('form')

  values.forEach(({ name, value }) => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = name
    input.value = value
    form.appendChild(input)
  })

  form.method = method
  form.action = action

  document.body.appendChild(form)
  form.submit()
}

async function login() {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 100)
  })

  return {
    body: JSON.stringify({ message: 'Hello World!' }),
    statusCode: 200,
  }
}

export { login as handler }

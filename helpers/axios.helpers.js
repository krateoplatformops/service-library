const errorHandler = (err) => {
  if (err.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    // console.log(error.response.data)
    // console.log(error.response.status)
    // console.log(error.response.headers)
    return {
      status: err.response.status,
      message: err.response.data
    }
  } else if (err.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    return {
      status: 503,
      message: 'The request was made but no response was received'
    }
  }

  // Something happened in setting up the request that triggered an Error
  return {
    status: 500,
    message:
      'Something happened in setting up the request that triggered an Error'
  }
}

module.exports = {
  errorHandler
}

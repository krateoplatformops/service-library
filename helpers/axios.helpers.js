const errorHandler = (err, res) => {
  if (err.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    // console.log(error.response.data)
    // console.log(error.response.status)
    // console.log(error.response.headers)
    return res.status(err.response.status).json({
      message: err.response.data
    })
  } else if (err.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    return res.status(503).json({
      message: 'The request was made but no response was received'
    })
  }

  // Something happened in setting up the request that triggered an Error
  return res.status(500).json({
    message:
      'Something happened in setting up the request that triggered an Error'
  })
}

module.exports = {
  errorHandler
}

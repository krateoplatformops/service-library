const axios = require('axios')
const { envConstants } = require('../constants')
const uriHelpers = require('./uri.helpers')
const logger = require('./logger.helpers')
const stringHelpers = require('./string.helpers')

const getFile = async ({ endpointName, path, fileName }) => {
  try {
    const location = encodeURIComponent('[' + path.join('][') + ']')

    logger.debug(location)

    const gitUrl = uriHelpers.concatUrl([
      envConstants.GIT_URI,
      endpointName,
      location
    ])
    logger.debug(gitUrl)

    const response = (await axios.get(gitUrl)).data

    return stringHelpers.b64toAscii(response.list[0].content)
  } catch {
    return null
  }
}

module.exports = {
  getFile
}

const k8s = require('@kubernetes/client-node')
const request = require('request')
const yaml = require('js-yaml')
const logger = require('./logger.helpers')

const create = async (client, spec) => {
  spec.metadata = spec.metadata || {}
  spec.metadata.annotations = spec.metadata.annotations || {}
  delete spec.metadata.annotations[
    'kubectl.kubernetes.io/last-applied-configuration'
  ]
  spec.metadata.annotations[
    'kubectl.kubernetes.io/last-applied-configuration'
  ] = JSON.stringify(spec)
  return await client
    .read(spec)
    .then(async () => {
      return await client
        .patch(
          spec,
          {},
          {},
          {},
          {},
          {
            headers: {
              'content-type': 'application/merge-patch+json'
            }
          }
        )
        .then(async (item) => {
          logger.debug('patched')
          return item.body
        })
        .catch(async (err) => {
          logger.debug(`Error patching ${spec.kind} ${spec.metadata.name}`)
          return err
        })
    })
    .catch(async () => {
      return await client
        .create(spec)
        .then(async (item) => {
          logger.debug(`Create ${spec.kind} ${spec.metadata.name}`)
          return item.body
        })
        .catch(async (err) => {
          logger.debug(`Error creating ${spec.kind} ${spec.metadata.name}`)
          return err
        })
    })
}

const wait = async (client, spec) => {
  const maxAttempts = 10
  let ready = false
  let attempt = 0

  while (!ready || attempt < maxAttempts) {
    await client
      .read(spec)
      .then(async (res) => {
        try {
          const installed = res.body.status.conditions.find(
            (x) => x.type === 'Installed'
          )
          const healthy = res.body.status.conditions.find(
            (x) => x.type === 'Healthy'
          )
          if (installed.status === 'True' && healthy.status === 'True') {
            ready = true
          } else {
            await new Promise((resolve) => setTimeout(resolve, 1000))
          }
        } catch {
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      })
      .catch(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      })
    attempt++
  }
  if (!ready)
    throw new Error(`Timeout waiting for ${spec.kind} ${spec.metadata.name}`)
}

const remove = async (client, spec) => {
  return await client
    .delete(spec)
    .then(async (item) => {
      logger.info(`Delete ok ${spec.kind} ${spec.metadata.name}`)
      return item
    })
    .catch(async (err) => {
      logger.info(`Error deleting ${spec.kind} ${spec.metadata.name}`)
      return err
    })
}

const getList = async (api) => {
  const kc = new k8s.KubeConfig()
  kc.loadFromDefault()

  const opts = {}
  kc.applyToRequest(opts)
  const s = await new Promise((resolve, reject) => {
    request(
      encodeURI(`${kc.getCurrentCluster().server}${api}`),
      opts,
      (error, response, data) => {
        logger.debug(JSON.stringify(response))
        if (error) {
          logger.error(error)
          reject(error)
        } else resolve(data)
      }
    )
  })

  const payload = yaml.load(s)

  return payload.items
}

const getSingleByName = async (api, name) => {
  const kc = new k8s.KubeConfig()
  kc.loadFromDefault()

  const opts = {}
  kc.applyToRequest(opts)
  const s = await new Promise((resolve, reject) => {
    request(
      encodeURI(`${kc.getCurrentCluster().server}${api}/${name}`),
      opts,
      (error, response, data) => {
        logger.debug(JSON.stringify(response))
        if (response.statusCode === 200) {
          resolve(data)
        }
        reject(error)
      }
    )
  })

  const payload = yaml.load(s)

  return payload
}

const getSingleByUid = async (api, uid) => {
  const list = await getList(api)
  const item = list.find((x) => x.metadata.uid === uid)

  if (!item) {
    const error = new Error(`${uid} not found`)
error.statusCode = 404
throw error;
  }

  return item
}

const deleteByName = async (api, name) => {
  const kc = new k8s.KubeConfig()
  kc.loadFromDefault()

  const opts = {}
  kc.applyToRequest(opts)
  return await new Promise((resolve, reject) => {
    request.delete(
      encodeURI(`${kc.getCurrentCluster().server}${api}/${name}`),
      opts,
      (error, response, data) => {
        logger.debug(JSON.stringify(data))
        if (response.statusCode === 200) {
          resolve(data)
        }
        reject(error)
        if (error) {
          logger.error(error)
          reject(error)
        } else resolve(data)
      }
    )
  })
}

module.exports = {
  create,
  wait,
  remove,
  getList,
  getSingleByName,
  getSingleByUid,
  deleteByName
}

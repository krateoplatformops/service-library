const parse = (data) => {
  delete data.metadata.creationTimestamp
  delete data.metadata.generation
  delete data.metadata.resourceVersion
  delete data.metadata.selfLink
  delete data.metadata.managedFields
  delete data.status
  delete data.metadata.annotations
  delete data.metadata.finalizers
  delete data.metadata.ownerReferences
  delete data.metadata.deletionTimestamp
  delete data.metadata.deletionGracePeriodSeconds
  delete data.metadata.clusterName
  delete data.metadata.initializers
  delete data.metadata.generateName

  return data
}

module.exports = {
  parse
}

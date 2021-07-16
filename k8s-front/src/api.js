import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',
})

const makeRequest = (path) => api.get(`${path}`)

const getAnything = async (path) => {
  try {
    const {
      data: { items },
      data,
    } = await makeRequest(path)
    return [items || data, null]
  } catch (e) {
    return [null, e]
  }
}

export const kubeApi = {
  getNamespaces: () => getAnything('/namespace/get-namespaces'),

  getPods: (name) => getAnything(`/pod/get-pods/${name}`),

  getServices: (name) => getAnything(`/service/get-services/${name}`),
  getNodes: (name) => getAnything(`/node/get-nodebyname/${name}`),
  getDeployments: (name) => getAnything(`/deployment/get-deployments/${name}`),
  getDaemonsets: (name) => getAnything(`/daemonset/get-daemonsets/${name}`),
  getReplicasetss: (name) => getAnything(`/replicaset/get-replicasets/${name}`),
  getIngresses: (name) => getAnything(`/ingress/get-ingresses/${name}`),
}

import React, { useEffect, useState } from 'react'
import { kubeApi } from '../../api'
import MainPresenter from './MainPresenter'
import Test from './test'
const MainContainer = ({ nowNamespace, hierarchical }) => {
  const [objects, setObjects] = useState({
    loading: true,
    pods: [],
    services: [],
    nodes: [],
    deployment: [],
    daemonset: [],
    replicaset: [],
    ingress: [],
    podsError: null,
    servicesError: null,
    nodesError: null,
    deploymentError: null,
    daemonsetError: null,
    replicasetError: null,
    ingressError: null,
  })
  const getData = async (nowNamespace) => {
    const [pods, podsError] = await kubeApi.getPods(nowNamespace)
    const [services, servicesError] = await kubeApi.getServices(nowNamespace)
    const [nodes, nodesError] = await kubeApi.getNodes(nowNamespace)
    const [deployment, deploymentError] = await kubeApi.getDeployments(
      nowNamespace
    )
    const [daemonset, daemonsetError] = await kubeApi.getDaemonsets(
      nowNamespace
    )
    const [replicaset, replicasetError] = await kubeApi.getReplicasetss(
      nowNamespace
    )
    const [ingress, ingressError] = await kubeApi.getIngresses(nowNamespace)
    setObjects({
      loading: false,
      pods,
      services,
      nodes,
      deployment,
      daemonset,
      replicaset,
      ingress,
      podsError,
      servicesError,
      nodesError,
      deploymentError,
      daemonsetError,
      replicasetError,
      ingressError,
    })
  }

  useEffect(() => {
    console.log('현재')
    console.log(nowNamespace)
    if (nowNamespace !== 'dg8s') getData(nowNamespace)
  }, [nowNamespace])

  useEffect(() => {
    console.log('objects')
    console.log(objects)
  }, [objects])
  // return <MainPresenter {...objects} />
  if (nowNamespace === 'dg8s') {
    return (
      <MainPresenter loading={objects.loading} hierarchical={hierarchical} />
    )
  } else {
    return (
      <Test
        nowNamespace={nowNamespace}
        hierarchical={hierarchical}
        {...objects}
      />
    )
  }
}

export default MainContainer

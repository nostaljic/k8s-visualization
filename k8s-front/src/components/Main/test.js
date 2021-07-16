import React, { useState, useEffect, useCallback } from 'react'
import DotLoader from 'react-spinners/DotLoader'
import { css } from '@emotion/react'
import styled from 'styled-components'
import Graph from 'react-vis-network-graph'
import deepmerge from 'deepmerge'
import { Colors } from '../styles'

import logoIcon from '../../assets/logo.png'
import pods from '../../assets/pods.png'
import ingress from '../../assets/ingress.png'
import kubernetes from '../../assets/kubernetes.png'
import services from '../../assets/services.png'
import deployments from '../../assets/deployments.png'
import replicasets from '../../assets/replicasets.png'
import { Modal } from 'antd'
import icons from '../Objects'

// pods, service, deployment, replicaset
const override = css`
  display: block;
  margin: 50px auto;
  border-color: greenyellow;
`

const options = {
  autoResize: true,

  layout: {
    hierarchical: {
      enabled: true,
      levelSeparation: 100,
      nodeSpacing: 10,
      treeSpacing: 60,
      blockShifting: true,
      edgeMinimization: true,
      parentCentralization: true,
      direction: 'DU', // UD, DU, LR, RL
      sortMethod: 'directed', // hubsize, directed
    },
  },
  width: '100%',
  height: '100%',
  interaction: {
    hover: true,
    navigationButtons: true,
    keyboard: {
      enabled: true,
      speed: {
        x: 10,
        y: 10,
        zoom: 0.01,
      },
      bindToWindow: true,
    },
  },
  nodes: {
    brokenImage: kubernetes,
    image: kubernetes,
    shape: 'image',
    size: 16,
    chosen: true,
    borderWidth: 0,
    color: {
      border: 'black',
      background: '#97C2FC',
      highlight: {
        border: '#2B7CE9',
        background: '#D2E5FF',
      },
      hover: {
        border: '#2B7CE9',
        background: '#D2E5FF',
      },
    },
  },
  physics: {
    enabled: true,
    repulsion: {
      nodeDistance: 200,
    },
    hierarchicalRepulsion: {
      centralGravity: 0.0,
      springLength: 100,
      springConstant: 0.01,
      nodeDistance: 80,
      damping: 0.09,
    },
  },
  edges: {
    color: '#000000',
    smooth: {
      enabled: true,
      type: 'dynamic',
      roundness: 0.8,
    },
  },
  groups: {
    master: {
      shape: 'image',
      image: {
        selected: kubernetes,
        unselected: kubernetes,
      },
    },
    pods: {
      shape: 'image',
      image: {
        selected: pods,
        unselected: pods,
      },
    },
    services: {
      shape: 'image',
      image: {
        selected: services,
        unselected: services,
      },
    },
    ingress: {
      shape: 'image',
      image: {
        selected: ingress,
        unselected: ingress,
      },
    },
    deployments: {
      shape: 'image',
      image: {
        selected: deployments,
        unselected: deployments,
      },
    },
    replicasets: {
      shape: 'image',
      image: {
        selected: replicasets,
        unselected: replicasets,
      },
    },
  },
}

const Test = ({
  loading,
  pods,
  services,
  nodes,
  deployment,
  daemonset,
  replicaset,
  ingress,
  nowNamespace,
  hierarchical,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [nodeInfo, setNodeInfo] = useState({})
  const [modalData, setModalData] = useState({})
  const showModal = useCallback(
    (nodes) => {
      if (nodeInfo[nodes]) {
        setModalData(nodeInfo[nodes])
        console.log('노드 인포!!')
        console.log(nodeInfo[nodes])
        setIsModalVisible(true)
      }
    },
    [nodeInfo]
  )

  const handleOk = useCallback(() => {
    setIsModalVisible(false)
    options.physics.enabled = true
  }, [])

  const handleCancel = useCallback(() => {
    setIsModalVisible(false)
    options.physics.enabled = true
  }, [])

  const [graphs, setGraphs] = useState({
    graph: {
      nodes: [],
      edges: [],
    },
    events: {},
  })

  const selectItem = (nodes, edges) => {
    console.log('Selected nodes:')
    console.log(nodes)
    console.log('Selected edges:')
    console.log(edges)
    console.log(nodeInfo)
    console.log(nodeInfo[nodes])
    showModal(nodes)
  }

  const makeGraph = useCallback(
    (items, type) => {
      let results = []
      let edges = []
      let info = {}

      for (let idx in items) {
        console.log(type, items[idx])
        const { metadata, status } = items[idx]

        if (metadata) {
          info[metadata.name + type] = status
          results.push({
            id: `${metadata.name}${type}`,
            label: metadata.name,
            color: Colors[type],
            group: type,
          })
          if (type === 'pods') {
            console.log('왜 안됨')
            console.log(metadata)
            if (metadata.ownerReferences) {
              const parseOwner = metadata.ownerReferences[0]?.kind.toLowerCase()
              edges.push({
                from: `${metadata.name}${type}`,
                to: `${metadata.ownerReferences[0]?.name}${parseOwner}s`,
                // to: type,
              })
            }
          } else {
            edges.push({
              from: `${metadata.name}${type}`,
              to: `${metadata.labels?.service}services`,
              // to: type,
            })
          }
        }
      }
      const c = Object.assign({}, graphs)
      c.graph.nodes = [...c.graph.nodes, ...results]
      c.graph.edges = [...c.graph.edges, ...edges]

      console.log('info')
      console.log(info)
      setNodeInfo(Object.assign(nodeInfo, info))
      c.events = {
        select: ({ nodes, edges }) => {
          console.log('info Data')
          console.log(info)
          selectItem(nodes, edges)
          // alert('Selected node: ' + nodes)
        },
      }

      console.log('new')
      console.log(c)
      setNodeInfo(info)
      setGraphs(c)

      // setGraphElement({
      //   graph: {
      //     nodes: results,
      //     edges: edges,
      //   },
      //   events: {
      //     select: ({ nodes, edges }) => {
      //       console.log('Selected nodes:')
      //       console.log(nodes)
      //       console.log('Selected edges:')
      //       console.log(edges)
      //       // alert('Selected node: ' + nodes)
      //     },
      //   },
      // })
    },
    [graphs]
  )

  useEffect(() => {
    makeGraph(pods, 'pods')
    makeGraph(services, 'services')
    makeGraph(nodes, 'nodes')
    makeGraph(deployment, 'deployments')
    makeGraph(daemonset, 'daemonset')
    makeGraph(replicaset, 'replicasets')
    makeGraph(ingress, 'ingress')
  }, [pods, services, nodes, deployment, replicaset, ingress, daemonset])
  // useEffect(() => {
  //   makeGraph(services, 'service')
  // }, [services])
  // useEffect(() => {
  //   makeGraph(nodes, 'nodes')
  // }, [nodes])
  // useEffect(() => {
  //   makeGraph(deployment, 'deployment')
  // }, [deployment])
  // useEffect(() => {
  //   makeGraph(daemonset, 'daemonset')
  // }, [daemonset])
  // useEffect(() => {
  //   makeGraph(replicaset, 'replicaset')
  // }, [replicaset])
  // useEffect(() => {
  //   makeGraph(ingress, 'ingress')
  // }, [ingress])

  // useEffect(() => {
  // setGraphs(deepmerge(graphs, graphElement))
  // console.log('그래프')
  // console.log(graphs)
  // console.log('newGra')
  // console.log(graphElement)
  // }, [graphElement])

  useEffect(() => {
    setGraphs({
      graph: {
        nodes: [],
        edges: [],
      },
      events: {},
    })
  }, [nowNamespace])

  if (loading)
    return (
      <DotLoader
        speedMultiplier={2}
        color={'#36D7B7'}
        loading={loading}
        css={override}
        size={80}
      />
    )

  let { graph, events } = graphs
  options.layout.hierarchical.enabled = hierarchical
  return (
    console.log('here4'),
    (
      <>
        {isModalVisible && modalData && (
          <Modal
            title="Component Info."
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            {Object.keys(modalData).map(function (key) {
              console.log(key, modalData[key], typeof modalData[key])
              if (typeof modalData[key] !== 'object') {
                return (
                  <p key={Math.random()}>
                    {key}: {modalData[key]}
                  </p>
                )
              }
            })}
            {/* <p>Some contents...</p>
          <p>Some contents...</p> */}
          </Modal>
        )}

        <Graph
          key={Math.random()}
          graph={graph}
          options={options}
          events={events}
          style={{
            height: '100vh',
            width: '90%',
          }}
        />
      </>
    )
  )
}

export default Test

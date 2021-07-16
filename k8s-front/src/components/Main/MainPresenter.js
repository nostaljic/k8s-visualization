import React, { useState, useEffect, useCallback } from 'react'
import DotLoader from 'react-spinners/DotLoader'
import { css } from '@emotion/react'
import styled from 'styled-components'
import Graph from 'react-vis-network-graph'
import deepmerge from 'deepmerge'
import { Colors } from '../styles'

import { Icons } from '../Objects'
import { Modal } from 'antd'
import icons from '../Objects'

const {
  pods,
  services,
  ingress,
  deployments,
  daemonsets,
  replicasets,
  kubernetes,
} = Icons
// pods, service, deployment, replicaset
const override = css`
  display: block;
  margin: 50px auto;
  border-color: greenyellow;
`

const Container = styled.div`
  padding: 24;
  background-color: '#ffffff';
  min-height: 360px;
  width: 100%;
  height: 100%;
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
    daemonsets: {
      shape: 'image',
      image: {
        selected: daemonsets,
        unselected: daemonsets,
      },
    },
  },
}

function randomColor() {
  const red = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, '0')
  const green = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, '0')
  const blue = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, '0')
  return `#${red}${green}${blue}`
}

const colors = { PodList: '#e04141', Service: '#e09c41' }

const Main = ({ loading, hierarchical }) => {
  const [objects, setObjects] = useState({})

  // 예시
  const [state, setState] = useState({
    // counter: 5,
    graph: {
      nodes: [
        { id: 1, label: 'jw-pod', color: Colors['pods'], group: 'pods' },
        { id: 2, label: 'sw-pod', color: Colors['pods'], group: 'pods' },
        { id: 3, label: 'jy-pod', color: Colors['pods'], group: 'pods' },
        { id: 4, label: 'jh-pod', color: Colors['pods'], group: 'pods' },
        { id: 5, label: 'ingress', color: Colors['ingress'], group: 'ingress' },
        {
          id: 6,
          label: 'myIngress',
          color: Colors['ingress'],
          group: 'ingress',
        },
        {
          id: 7,
          label: 'goodDeploy',
          color: Colors['deployments'],
          group: 'deployments',
        },
        {
          id: 8,
          label: 'myService',
          color: Colors['services'],
          group: 'services',
        },
        { id: 9, label: 'newServie', color: Colors['pods'], group: 'services' },
        {
          id: 10,
          label: 'service 6',
          color: Colors['services'],
          group: 'services',
        },
        {
          id: 11,
          label: 'pods 11',
          color: Colors['pods'],
          group: 'pods',
        },
        {
          id: 12,
          label: 'pods 12',
          color: Colors['pods'],
          group: 'pods',
        },
        {
          id: 13,
          label: 'replicasets 6',
          color: Colors['replicasets'],
          group: 'replicasets',
        },
        {
          id: 14,
          label: 'replicasets 7',
          color: Colors['replicasets'],
          group: 'replicasets',
        },
        {
          id: 15,
          label: 'replicasets 8',
          color: Colors['replicasets'],
          group: 'replicasets',
        },
        {
          id: 16,
          label: 'daemonsets 6',
          color: Colors['daemonsets'],
          group: 'daemonsets',
        },
        {
          id: 17,
          label: 'daemonsets',
          color: Colors['daemonsets'],
          group: 'daemonsets',
        },
        {
          id: 18,
          label: 'niceDeploy',
          color: Colors['deployments'],
          group: 'deployments',
        },
        {
          id: 19,
          label: 'newIngress',
          color: Colors['ingress'],
          group: 'ingress',
        },
      ],
      edges: [
        { from: 1, to: 8 },
        { from: 1, to: 13 },
        { from: 2, to: 13 },
        { from: 3, to: 15 },
        { from: 4, to: 15 },
        { from: 8, to: 5 },
        { from: 13, to: 9 },
        { from: 11, to: 14 },
        { from: 9, to: 6 },
        { from: 12, to: 14 },
        { from: 14, to: 10 },
        { from: 13, to: 7 },
        { from: 14, to: 18 },
        { from: 10, to: 19 },
      ],
    },
    events: {
      select: ({ nodes, edges }) => {
        console.log('Selected nodes:')
        console.log(nodes)
        console.log('Selected edges:')
        console.log(edges)
        // alert('Selected node: ' + nodes)
      },
    },
  })
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

  const { graph, events } = state
  options.layout.hierarchical.enabled = hierarchical
  return (
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
  )
}

export default Main

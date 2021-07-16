import React, { useState, useEffect } from 'react'
import { Layout, Menu, Breadcrumb, Switch, Divider } from 'antd' // 필요한 컴포넌트를 가져온다
import 'antd/dist/antd.css' // css를 가져온다
import styled from 'styled-components'
import Icon, { NotificationTwoTone } from '@ant-design/icons'
import { kubeApi } from './api'
import DotLoader from 'react-spinners/DotLoader'
import { css } from '@emotion/react'

import namespaceIcon from './assets/namespace.png'
import logoIcon from './assets/logo.png'
import backgroundLogo from './assets/backgroundLogo.png'
import Main from './components/Main/MainContainer'

import { Icons } from './components/Objects'
import { Colors } from './components/styles'

const override = css`
  display: block;
  margin: 150px auto;
  border-color: greenyellow;
`

const Background = styled.img`
  top: 25%;
  left: 25%;
  position: absolute;
  /* width: 100px;
  height: 100px; */
  opacity: 0.3;
`

const { SubMenu } = Menu
const { Header, Content, Sider, Footer } = Layout

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const Logo = styled.img`
  height: 60%;
  width: 60%;
  min-width: 80px;
  margin: 16px auto;
  text-align: center;
`

const Image = styled.img`
  width: 30px;
  height: 30px;
`

const ItemText = styled.span`
  display: inline-block;
  margin-right: 10px;
  font-size: large;
`
const CircleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  margin: 20px;
  /* margin-top: 10px; */
  line-height: 20px;
`
const Circle = styled.img`
  width: 30px;
  height: 30px;
`

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [isPod, setIsPod] = useState(true)
  const [collapsed, setCollapsed] = useState(false)
  const [namespaces, setNamespaces] = useState({})
  const [nowNamespace, setNowNamespace] = useState('default')
  const [hierarchical, setHierarchical] = useState(false)
  let defaultNamespace = 'default'

  const onCollapse = (collapsed) => {
    setCollapsed((collapsed) => !collapsed)
  }

  function onChange(checked) {
    setHierarchical(checked)
  }

  const toggleTheme = (isChecked) => {
    setIsPod(isChecked)
  }

  const handleNamespace = ({ key }) => {
    setNowNamespace(key)
  }
  const getNamespaces = async () => {
    const [items, itemsError] = await kubeApi.getNamespaces()
    console.log('아이템들!')
    console.log(items)

    setNamespaces(items)

    // defaultNamespace = items[0].metadata.name

    setIsLoading(false)
  }

  useEffect(() => {
    getNamespaces()
  }, [])

  if (isLoading)
    return (
      <DotLoader
        speedMultiplier={2}
        color={'#36D7B7'}
        loading={isLoading}
        css={override}
        size={150}
      />
    )

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
        width={300}
        style={{ backgroundColor: '#406ddd' }}
      >
        <LogoContainer>
          <Logo src={logoIcon} alt="logo" />
        </LogoContainer>
        <Menu
          theme="dark"
          style={{ backgroundColor: '#406ddd' }}
          defaultSelectedKeys={defaultNamespace}
          mode="vertical"
          onClick={handleNamespace}
        >
          {namespaces.map((namespace) => {
            const {
              metadata: { name },
            } = namespace
            return (
              <>
                <Menu.Divider
                  style={{
                    height: '3px',
                    backgroundColor: 'lightgray',
                  }}
                ></Menu.Divider>
                <Menu.Item
                  key={name}
                  icon={<Image src={namespaceIcon} alt="namespace" />}
                >
                  <ItemText>{name}</ItemText>
                </Menu.Item>
              </>
            )
          })}
          <Menu.Divider
            style={{ height: '3px', backgroundColor: 'lightgray' }}
          ></Menu.Divider>
          <Menu.Item
            key="dg8s"
            icon={<Image src={namespaceIcon} alt="namespace" />}
          >
            <ItemText>dg8s</ItemText>
          </Menu.Item>
          <Menu.Divider
            style={{ height: '3px', backgroundColor: 'lightgray' }}
          ></Menu.Divider>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: 0,
            display: 'flex',
            height: '80px',
          }}
        >
          {Object.keys(Icons).map(function (key) {
            return (
              <CircleContainer key={Math.random()}>
                <Circle src={Icons[key]} alt={key}></Circle>
                {key}
              </CircleContainer>
            )
          })}

          {/* {Colors.map((color) => {
            return <Circle>{color}</Circle>
          })} */}
        </Header>
        <Content
          style={{
            margin: '0 16px',
          }}
        >
          <Background src={backgroundLogo} />
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>현재 namespace: {nowNamespace}</Breadcrumb.Item>
          </Breadcrumb>
          <Switch onChange={onChange} />
          <Main nowNamespace={nowNamespace} hierarchical={hierarchical}></Main>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          DG8S ©2021 Created by Fullstack
        </Footer>
      </Layout>
    </Layout>
  )
}

export default App

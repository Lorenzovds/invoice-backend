import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import InvoicesContainer from './invoices-container'
import {Header,
  Container, Menu, Icon } from 'semantic-ui-react'
import { withAuth } from '@okta/okta-react'

import '../App.css'

class AuthenticatedContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sidebarVisible: true,
      sidebarButton: 'angle double left'
    }
    this.setActiveMenu = this.setActiveMenu.bind(this)
    this.auth = props.auth
  }

  render () {
    return (
      <div style={{
        height: 'auto',
        width: '100vw',
        display: 'inline-flex',
        minHeight: '100%' }}>
        { this.renderMenu() }
        <Container fluid style={{padding: '15px'}}>
          { this.renderHeader() }
          { this.renderRouter() }
        </Container>
      </div>
    )
  }

  renderMenu () {
    const { activeItem } = this.state
    return (
      <Menu
        size='large'
        vertical
        inverted
        floated
        width='thin'>
        <Menu.Item
          as={Link}
          name='home'
          onClick={this.handleMenuClick.bind(this)}
          active={activeItem === 'home'}
          to='/'>
          <Icon name={'home'} />
          Home
        </Menu.Item>
        <Menu.Item
          name='all'
          as={Link}
          onClick={this.handleMenuClick.bind(this)}
          to='/invoices'
          active={activeItem === 'all'}>
          <Icon name='list layout' />
          All
        </Menu.Item>
        <Menu.Item
          name='new'
          as={Link}
          onClick={this.handleMenuClick.bind(this)}
          to='/invoices/new'
          active={activeItem === 'new'}>
          <Icon name='plus square outline' />
          New
        </Menu.Item>
        <Menu.Item
          name='logout'
          onClick={this.auth.logout}>
          <Icon name='key' />
          Logout
        </Menu.Item>
      </Menu>
    )
  }

  renderHeader () {
    return (
      <Header as='h2' icon textAlign='center'>
        <Icon name='book' circular />
        <Header.Content>
          Facturatie programma
        </Header.Content>
      </Header>
    )
  }

  renderRouter () {
    return (
      <Switch>
        <Route exact path='/' render={() => <Redirect to='/invoices' />} />
        <Route path='/invoices' render={props => <InvoicesContainer setActiveMenu={this.setActiveMenu} />} />
      </Switch>
    )
  }

  handleMenuClick (e, { name }) {
    this.setActiveMenu(name)
  }

  setActiveMenu (name) {
    this.setState({ activeItem: name })
  }
}

export default withAuth(AuthenticatedContainer)

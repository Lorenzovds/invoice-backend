import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import InvoicesContainer from './invoices-container'
import {Header, Grid,
  Segment, Menu, Icon } from 'semantic-ui-react'
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
        <Segment raised style={{margin: '15px', 'width': '100%'}}>
          { this.renderHeader() }
          { this.renderRouter() }
        </Segment>
      </div>
    )
  }

  renderMenu () {
    const { activeItem } = this.state
    return (
      <Menu
        size='huge'
        vertical
        inverted
        borderless
        floated
        pointing
        style={{'minHeight': '100%'}}>
        <Grid verticalAlign='middle' textAlign='center' style={{width: 'auto', height: '100%'}}>
          <Grid.Column verticalAlign='middle'>
            <Menu.Item
              name='all'
              as={Link}
              onClick={this.handleMenuClick.bind(this)}
              to='/invoices'
              active={activeItem === 'all'}>
              <Icon name='list layout' />
              Alle facturen
            </Menu.Item>
            <Menu.Item
              name='new'
              as={Link}
              onClick={this.handleMenuClick.bind(this)}
              to='/invoices/new'
              active={activeItem === 'new'}>
              <Icon name='plus square outline' />
              Nieuw / aanpassen
            </Menu.Item>
            <Menu.Item
              name='clean'
              as={Link}
              onClick={this.handleMenuClick.bind(this)}
              to='/invoices/clean'
              active={activeItem === 'clean'}>
              <Icon name='download' />
              Downloaden
            </Menu.Item>
            <Menu.Item
              name='logout'
              onClick={this.auth.logout}>
              <Icon name='key' />
              Uitloggen
            </Menu.Item>
          </Grid.Column>
        </Grid>
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

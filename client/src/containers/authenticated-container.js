import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import InvoicesContainer from './invoices-container'
import {Header, Sidebar, Grid,
  Segment, Menu, Icon, Button, Container } from 'semantic-ui-react'
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
    const { sidebarVisible } = this.state
    return (
      <div style={{ height: '100vh' }}>
        <Sidebar.Pushable as={Segment}>
          <Sidebar as={Menu}
            visible={sidebarVisible}
            animation='push'
            width='thin'
            icon='labeled'
            vertical
            inverted>
            {this.renderMenu()}
          </Sidebar>
          <Sidebar.Pusher>
            <Button
              onClick={() => this.toggleSidebar()}
              icon={this.state.sidebarButton}
              style={{position: 'fixed', marginTop: '50vh'}}
              floated='left' />
            <Grid style={{'marginLeft': '5%'}}>
              <Grid.Row>
                <Grid.Column style={{width: '75vw'}}>
                  { this.renderHeader() }
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column style={{width: '75vw'}}>
                  <Container fluid>
                    { this.renderRouter() }
                  </Container>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    )
  }

  renderMenu () {
    const { activeItem } = this.state
    return (
      <div>
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
      </div>
    )
  }

  renderHeader () {
    return (
      <Segment basic style={{ marginTop: '2em' }}>
        <Header as='h2' icon textAlign='center'>
          <Icon name='book' circular />
          <Header.Content>
            Facturatie programma
          </Header.Content>
        </Header>
      </Segment>
    )
  }

  renderRouter () {
    return (
      <Segment raised>
        <Switch>
          <Route exact path='/' render={() => <Redirect to='/invoices' />} />
          <Route path='/invoices' render={props => <InvoicesContainer setActiveMenu={this.setActiveMenu} />} />
        </Switch>
      </Segment>
    )
  }

  handleMainBodyClick () {
    const { sidebarVisible } = this.state
    if (sidebarVisible) this.toggleSidebar(false)
  }

  toggleSidebar (state) {
    const newState = state || !this.state.sidebarVisible
    this.setState({ sidebarVisible: newState })
    this.setState({ sidebarButton: newState ? 'angle double left' : 'angle double right' })
  }

  handleMenuClick (e, { name }) {
    this.setActiveMenu(name)
  }

  setActiveMenu (name) {
    this.setState({ activeItem: name })
  }
}

export default withAuth(AuthenticatedContainer)

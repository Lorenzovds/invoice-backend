import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router'
import InvoicesContainer from './invoices-container'
import {Header, Sidebar, Grid,
  Segment, Menu, Icon, Button } from 'semantic-ui-react'

import '../App.css'

class AuthenticatedContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sidebarVisible: false,
      sidebarButton: 'angle double right',
      activeItem: 'home'
    }
  }

  render () {
    const { sidebarVisible } = this.state
    return (
      <div style={{ height: '100vh' }}>
        <Sidebar.Pushable as={Segment}>
          <Sidebar as={Menu}
            visible={sidebarVisible}
            animation='slide along'
            width='thin'
            icon='labeled'
            vertical
            inverted>
            {this.renderMenu()}
          </Sidebar>
          <Sidebar.Pusher onClick={() => this.handleMainBodyClick()}>
            <Grid columns='equal'>
              <Grid.Row>
                <Grid.Column width={1}>
                  <Button
                    onClick={() => this.toggleSidebar()}
                    icon={this.state.sidebarButton}
                    style={{marginTop: '50vh'}}
                    floated='left' />
                </Grid.Column>
                <Grid.Column>
                  <Grid columns='equal'>
                    <Grid.Row>
                      <Grid.Column>
                        { this.renderHeader() }
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column>
                        { this.renderRouter() }
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
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
      <Menu.Item name='home'
        onClick={this.handleMenuClick.bind(this)}
        active={activeItem === 'home'}>
        <Icon name='home' />
        Home
      </Menu.Item>
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
          <Route path='/invoices' component={InvoicesContainer} />
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
    this.setState({ activeItem: name })
  }
}

export default AuthenticatedContainer

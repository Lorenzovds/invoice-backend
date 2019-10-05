import React, { useState } from 'react'
import { Route, Switch, Redirect } from 'react-router'
import { Segment } from 'semantic-ui-react'
import { withAuth } from '@okta/okta-react'

import InvoicesContainer from './invoices-container'
import SideNav from './side-nav'

import styles from './authenticated-container.module.css'

const AuthenticatedContainer = ({ auth }) => {
  const { logout } = auth

  const [activeMenu, setActiveMenu] = useState('all')

  return (
    <div className={styles['main-container']}>
      <div>
        <SideNav handleLogout={logout} activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      </div>
      <Segment raised style={{ margin: '15px', width: '100%' }}>
        <NavRouter setActiveMenu={setActiveMenu} />
      </Segment>
    </div>
  )
}

const NavRouter = ({ setActiveMenu }) => {
  return (
    <Switch>
      <Route exact path='/' render={() => <Redirect to='/invoices' />} />
      <Route path='/invoices' render={props => <InvoicesContainer setActiveMenu={setActiveMenu} />} />
    </Switch>
  )
}

export default withAuth(AuthenticatedContainer)

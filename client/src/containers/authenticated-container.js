import React, { useState, useEffect } from 'react'
import { Route, Switch, Redirect } from 'react-router'
import { Segment, Loader } from 'semantic-ui-react'
import { withAuth } from '@okta/okta-react'
import { isEmpty } from 'lodash'

import InvoicesContainer from './invoices-container'
import SideNav from './side-nav'

import styles from './authenticated-container.module.css'

const AuthenticatedContainer = ({ auth }) => {
  const { logout } = auth

  const [activeMenu, setActiveMenu] = useState('all')
  const [user, setUser] = useState({})
  const [token, setToken] = useState('')

  useEffect(() => {
    try {
      auth.getUser()
        .then(user => setUser(user))
      auth.getAccessToken()
        .then(accessToken => setToken(accessToken))
    } catch (err) {
      console.error('failed to get user information, logging out')
      logout()
    }
  })

  if (isEmpty(token) || isEmpty(user)) {
    return <Loader>Gegegevens aan het ophalen.</Loader>
  }

  return (
    <div className={styles['main-container']}>
      <div className={styles['menu-container']}>
        <SideNav
          handleLogout={logout}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />
      </div>
      <Segment raised style={{ margin: '15px', width: '100%' }}>
        <Switch>
          <Route exact path='/'>
            <Redirect to='/invoices' />
          </Route>
          <Route path='/invoices'>
            <InvoicesContainer
              setActiveMenu={setActiveMenu}
              user={user}
              token={token}
            />
          </Route>
        </Switch>
      </Segment>
    </div>
  )
}

export default withAuth(AuthenticatedContainer)

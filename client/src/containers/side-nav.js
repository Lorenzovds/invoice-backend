import React from 'react'
import { Link } from 'react-router-dom'
import { Icon, Menu, Grid } from 'semantic-ui-react'

import styles from './side-nav.module.css'

const Nav = ({ handleLogout, activeMenu, setActiveMenu }) => {
  const handleMenuClick = (e, { name }) => {
    setActiveMenu(name)
  }

  return (
    <Menu
      size='huge'
      vertical
      inverted
      borderless
      floated
      pointing
      className={styles['menu-grid']}
    >
      <Grid
        verticalAlign='top'
        textAlign='center'
      >
        <Grid.Column verticalAlign='top'>
          <Menu.Item
            name='all'
            as={Link}
            onClick={handleMenuClick}
            to='/invoices'
            active={activeMenu === 'all'}
          >
            <Icon name='list layout' />
            Alle facturen
          </Menu.Item>
          <Menu.Item
            name='new'
            as={Link}
            onClick={handleMenuClick}
            to='/invoices/new'
            active={activeMenu === 'new'}
          >
            <Icon name='plus square outline' />
            Nieuw / aanpassen
          </Menu.Item>
          <Menu.Item
            name='clean'
            as={Link}
            onClick={handleMenuClick}
            to='/invoices/clean'
            active={activeMenu === 'clean'}
          >
            <Icon name='download' />
            Downloaden
          </Menu.Item>
          <Menu.Item
            name='logout'
            onClick={handleLogout}
          >
            <Icon name='key' />
            Uitloggen
          </Menu.Item>
        </Grid.Column>
      </Grid>
    </Menu>
  )
}

export default Nav

import React from 'react'
import { Link } from 'react-router-dom'
import { Icon, Menu } from 'semantic-ui-react'

import styles from './nav.module.css'

const Nav = ({ handleLogout, activeMenu, setActiveMenu }) => {
  const handleMenuClick = (e, { name }) => {
    setActiveMenu(name)
  }

  return (
    <Menu
      size='huge'
      tabular
      className={styles['menu-grid']}
    >
      <Menu.Item
        name='all'
        as={Link}
        onClick={handleMenuClick}
        to='/invoices'
        active={isActive(activeMenu, 'all')}
        color={isActive(activeMenu, 'all') ? 'olive' : 'black'}
      >
        <Icon name='list layout' />
        Alle facturen
      </Menu.Item>
      <Menu.Item
        name='new'
        as={Link}
        onClick={handleMenuClick}
        to='/invoices/new'
        active={isActive(activeMenu, 'new')}
        icon='plus square outline'
        color={isActive(activeMenu, 'new') ? 'olive' : 'black'}
      >
        Nieuw / aanpassen
      </Menu.Item>
      <Menu.Item
        name='clean'
        as={Link}
        onClick={handleMenuClick}
        to='/invoices/clean'
        active={isActive(activeMenu, 'clean')}
        color={isActive(activeMenu, 'clean') ? 'olive' : 'black'}
        icon='download'
      >
        Downloaden
      </Menu.Item>
      <Menu.Item
        name='logout'
        icon='key'
        position='right'
        onClick={handleLogout}
      >
        Uitloggen
      </Menu.Item>
    </Menu>
  )
}

const isActive = (active, current) => {
  return active === current
}

export default Nav

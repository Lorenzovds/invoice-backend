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
        color={isActive(activeMenu, 'new') ? 'olive' : 'black'}
      >
        <Icon name='plus square outline' />
        Nieuw / aanpassen
      </Menu.Item>
      <Menu.Item
        name='clean'
        as={Link}
        onClick={handleMenuClick}
        to='/invoices/clean'
        active={isActive(activeMenu, 'clean')}
        color={isActive(activeMenu, 'clean') ? 'olive' : 'black'}
      >
        <Icon name='download' />
        Downloaden
      </Menu.Item>
      <Menu.Item
        name='logout'
        position='right'
        onClick={handleLogout}
      >
        <Icon name='log out' />
      </Menu.Item>
    </Menu>
  )
}

const isActive = (active, current) => {
  return active === current
}

export default Nav

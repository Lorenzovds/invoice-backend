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
    </Menu>
  )
}

export default Nav

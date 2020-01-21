import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Menu } from 'semantic-ui-react'

import styles from './nav.module.css'

const Nav = ({ handleLogout, location }) => {
  const [activeMenu, setActiveMenu] = useState('all')

  useEffect(() => {
    const { pathname = '' } = location || {}

    const cleanedPathname = cleanPathName(pathname)

    switch (cleanedPathname) {
      case '/invoices': {
        setActiveMenu('all')
        break
      }
      case '/invoices/clean': {
        setActiveMenu('clean')
        break
      }
      case '/invoices/new': {
        setActiveMenu('new')
        break
      }
      default: setActiveMenu('all')
    }
  }, [location])

  return (
    <Menu
      size='huge'
      tabular
      className={styles['menu-grid']}
    >
      <Menu.Item
        name='all'
        as={Link}
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

const cleanPathName = (pathname) => {
  if (pathname.match('\\/invoices\\/[a-zA-Z0-9]{24}$')) return '/invoices/new'

  return pathname
}

const isActive = (active, current) => {
  return active === current
}

export default Nav

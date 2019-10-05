import React from 'react'
import { Route, Switch } from 'react-router'
import { withAuth } from '@okta/okta-react'
import axios from 'axios'

import NewInvoice from '../components/invoice/new-invoice'
import AllInvoices from '../components/invoice/all-invoices'
import ExampleInvoice from '../components/invoice/example-invoice'

import styles from './invoices-container.module.css'

const Invoices = ({ setActiveMenu, user, token }) => {
  const { sub: userId } = user

  return (
    <div className={styles['content-container']}>
      <Switch>
        <Route exact path='/invoices'>
          <AllInvoices setActiveMenu={setActiveMenu} getAllInvoices={getAllInvoices(userId, token)} deleteInvoice={deleteInvoice(userId, token)} />
        </Route>
        <Route exact path='/invoices/new'>
          <NewInvoice setActiveMenu={setActiveMenu} postInvoice={postInvoice(userId, token)} />
        </Route>
        <Route exact path='/invoices/clean'>
          <ExampleInvoice setActiveMenu={setActiveMenu} getAllInvoices={getAllInvoices(userId, token)} getUserInfo={getUserInfo(userId, token)} />
        </Route>
        <Route exact path='/invoices/:id'>
          <NewInvoice setActiveMenu={setActiveMenu} updateInvoice={updateInvoice(userId, token)} getInvoice={getInvoice(userId, token)} />
        </Route>
      </Switch>
    </div>
  )
}

const getUserInfo = (userId, token) => {
  return () => {
    return axios.get(`/api/users/${userId}`, {
      headers: { accessToken: token }
    })
  }
}

const postInvoice = (userId, token) => {
  return (invoice) => {
    return axios.post('/api/invoices', invoice, {
      headers: { accessToken: token }
    })
  }
}

const updateInvoice = (userId, token) => {
  return (invoice, id) => {
    return axios.put(`/api/invoices/${id}`, invoice, {
      headers: { accessToken: token }
    })
  }
}

const getAllInvoices = (userId, token) => {
  return () => {
    return axios.get('/api/invoices', {
      headers: { accessToken: token }
    })
  }
}

const getInvoice = (userId, token) => {
  return (id) => {
    return axios.get(`/api/invoices/${id}`, {
      headers: { accessToken: token }
    })
  }
}

const deleteInvoice = (userId, token) => {
  return (id) => {
    return axios.delete(`/api/invoices/${id}`, {
      headers: { accessToken: token }
    })
  }
}

export default withAuth(Invoices)

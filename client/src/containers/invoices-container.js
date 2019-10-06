import React, { useState } from 'react'
import { Route, Switch } from 'react-router'
import { withAuth } from '@okta/okta-react'
import axios from 'axios'

import NewInvoice from '../components/invoice/new-invoice'
import AllInvoices from '../components/invoice/all-invoices'
import ExampleInvoice from '../components/invoice/example-invoice'

import styles from './invoices-container.module.css'

const Invoices = ({ setActiveMenu, user, token }) => {
  const { sub: userId } = user

  const [error, setError] = useState('')

  const getUserInfo = (userId, token) => {
    return () => {
      return axios.get('/api/users/me', {
        headers: { accessToken: token }
      })
        .catch(err => {
          console.error(err, 'failed to get user information')
          setError('kon gebruikersinfo niet ophalen')
        })
    }
  }

  const postInvoice = (token) => {
    return (invoice) => {
      return axios.post('/api/invoices', invoice, {
        headers: { accessToken: token }
      })
        .catch(err => {
          console.error(err, 'failed to create invoice')
          setError('kon factuur niet opslaan')
        })
    }
  }

  const updateInvoice = (token) => {
    return (invoice, id) => {
      return axios.put(`/api/invoices/${id}`, invoice, {
        headers: { accessToken: token }
      })
        .catch(err => {
          console.error(err, 'failed to get update invoice')
          setError('kon factuur niet bijwerken')
        })
    }
  }

  const getAllInvoices = (token) => {
    return () => {
      return axios.get('/api/invoices', {
        headers: { accessToken: token }
      })
        .then(({ data }) => data)
        .catch(err => {
          console.error(err, 'failed to get get all invoices')
          setError('kon facturen niet ophalen')
        })
    }
  }

  const getInvoice = (token) => {
    return (id) => {
      return axios.get(`/api/invoices/${id}`, {
        headers: { accessToken: token }
      })
        .then(({ data }) => data)
        .catch(err => {
          console.error(err, 'failed to get get invoice')
          setError('kon factuur niet ophalen')
        })
    }
  }

  const deleteInvoice = (token) => {
    return (id) => {
      return axios.delete(`/api/invoices/${id}`, {
        headers: { accessToken: token }
      })
        .catch(err => {
          console.error(err, 'failed to delete invoice')
          setError('kon factuur niet verwijderen')
        })
    }
  }

  return (
    <div className={styles['content-container']}>
      <Switch>
        <Route exact path='/invoices'>
          <AllInvoices error={error} setActiveMenu={setActiveMenu} getAllInvoices={getAllInvoices(token)} deleteInvoice={deleteInvoice(token)} />
        </Route>
        <Route exact path='/invoices/new'>
          <NewInvoice error={error} setActiveMenu={setActiveMenu} postInvoice={postInvoice(token)} />
        </Route>
        <Route exact path='/invoices/clean'>
          <ExampleInvoice error={error} setActiveMenu={setActiveMenu} getAllInvoices={getAllInvoices(token)} getUserInfo={getUserInfo(userId, token)} />
        </Route>
        <Route exact path='/invoices/:id'>
          <NewInvoice error={error} setActiveMenu={setActiveMenu} updateInvoice={updateInvoice(token)} getInvoice={getInvoice(token)} />
        </Route>
      </Switch>
    </div>
  )
}

export default withAuth(Invoices)

import React, { Component } from 'react'
import '../App.css'

class NewInvoiceContainer extends Component {
  constructor (props) {
    super(props)
    this.setActiveMenu = props.setActiveMenu
  }

  componentWillMount () {
    this.setActiveMenu('new')
  }

  render () {
    return (
      <div>
        <h2>Create new Invoice</h2>
      </div>
    )
  }
}

export default NewInvoiceContainer

import React from 'react'
import OktaAuth from '@okta/okta-auth-js'
import { withAuth } from '@okta/okta-react'
import { Icon, Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'

export default withAuth(class LoginForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      sessionToken: null,
      error: null,
      username: '',
      password: ''
    }

    this.oktaAuth = new OktaAuth({ url: props.baseUrl })

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleUsernameChange = this.handleUsernameChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
  }

  handleSubmit (e) {
    e.preventDefault()
    this.oktaAuth.signIn({
      username: this.state.username,
      password: this.state.password
    })
      .then(res => this.setState({
        sessionToken: res.sessionToken
      }))
      .catch(err => {
        this.setState({error: err.message})
        console.log(err.statusCode + ' error', err)
      })
  }

  handleUsernameChange (e, { value }) {
    this.setState({ username: value })
  }

  handlePasswordChange (e, { value }) {
    this.setState({ password: value })
  }

  render () {
    if (this.state.sessionToken) {
      this.props.auth.redirect({ sessionToken: this.state.sessionToken })
      return null
    }

    const errorMessage = this.state.error
      ? <span className='error-message'>{this.state.error}</span>
      : null

    return (
      <div className='login-form'>
        <Grid
          textAlign='center'
          style={{ height: '100%' }}
          verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' textAlign='center'>
              <Icon name='key' />
              {' '}Log-in to your account
            </Header>
            <Form
              size='large'
              onSubmit={this.handleSubmit.bind(this)}>
              <Segment stacked>
                <Form.Input
                  fluid
                  icon='user'
                  value={this.state.username}
                  onChange={this.handleUsernameChange.bind(this)}
                  iconPosition='left'
                  placeholder='E-mail address'
                />
                <Form.Input
                  fluid
                  icon='lock'
                  value={this.state.password}
                  onChange={this.handlePasswordChange.bind(this)}
                  iconPosition='left'
                  placeholder='Password'
                  type='password'
                />

                <Button color='green' fluid size='large'>Login</Button>
              </Segment>
              {
                errorMessage && (
                  <Message
                    negative>
                    <Message.Header>Foute gebruikersnaam of wachtwoord</Message.Header>
                  </Message>
                )
              }
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
})

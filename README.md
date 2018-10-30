## invoice-backend

### Project
Basic project to create invoices and download them as pdf

### How to

To run the project 2 config files need to be added

#### Server side
Add a folder **config** with an **index.js** file containing:
```javascript
module.exports = {
  orgUrl: 'okta_url',
  token: 'okta_token',
  mongoDB: 'mongodb_url' // this is only used when running in production mode
  users: {
    uid_of_user: {
      name: '',
      street: '',
      number: '',
      town: '',
      zipcode: '',
      phone: '',
      mail: '',
      taxNr: '',
      iban: '',
      bic: '',
      logo: '',
      terms: defaultTerms
    }
  }
}
```

#### Client side

Add a file **app.config.js** in the src folder containing:
```javascript
export default {
  url: 'okta_url',
  issuer: 'okta_url/oauth2/default',
  redirect_uri: `${window.location.origin}/implicit/callback`,
  client_id: 'okta_client_id'
}
```

#### Starting
Either in one terminal or in two terminals.
* One terminal:
  ```bash
    yarn dev
  ```
* Two terminals:
  ```bash
    yarn server
    cd client && yarn client
  ```

### TODO
* Custom logo
* Custom terms
* Custom company info

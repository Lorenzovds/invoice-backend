const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const httpError = require('http-errors')
const cors = require('cors')

const router = require('./routes')
const logger = require('./lib/logger')
const pino = require('express-pino-logger')({
  logger
})

const whitelist = [
  'http://localhost:3000',
  'https://cryptic-bastion-96379.herokuapp.com',
  'http://cryptic-bastion-96379.herokuapp.com',
  'http://invoicer.vandesijpe.org'
]
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      logger.error({ origin }, 'failed to validate cors')
      callback(new Error('Not allowed by CORS'))
    }
  }
}

const {
  NODE_ENV = 'development'
} = process.env

const app = express()

// log every incomming request
app.use(pino)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(cors(corsOptions))

app.use('/api', router)

app.use('/', express.static(`${__dirname}/client/build`))
app.use('*', express.static(`${__dirname}/client/build`))

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(httpError(404))
})

// only send stacktrace when in development
app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .send({
      message: err.message,
      error: NODE_ENV === 'production' ? {} : err
    })
})

module.exports = app

'use strict'

const express = require('express')
const app = express()
const router = require('./routes.js')
const port = 4444
const proxyConf = require('../proxy.config.json')

const proxy = require('http-proxy-middleware')
const apiProxy = proxy({
  target: proxyConf.server,
  ws: true,
  changeOrigin: true
})

app.use(router)
app.use(apiProxy)
app.listen(port, () => {
  console.info(`Development server listening on http://localhost:${port}`)
})


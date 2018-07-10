'use strict'

const Q = require('q')
const fs = require('fs')
const path = require('path')
const express = require('express')
const router = express.Router()
const PAGETITLE = 'Ado Piso WiFi - Web Portal Dev'
const config = require('./config.json')
const index_html_path = path.join(__dirname, '../dist/index.html')
const splashbase64 = fs.readFileSync(path.join(__dirname, '../static/splash.txt'), 'utf8')

function attachPageTitle (html) {
  return Q(html.replace('PAGETITLE', PAGETITLE))
}

function attachSplashStyles(html) {
  return Q(splashbase64)
    .then(base64 => {
      return [base64, config]
    })
    .spread((base64, config) => {
      let style = `<style>
        html.loading #loading-container { background-color: #${config.splash.color}  }
      html.loading #loading { color: #${config.splash.textcolor}  }
        </style>
        `
      return [base64, style]
    })
    .spread((base64, style) => {
      let csspattern = '<!--SPLASHCSS-->'
      let splashpattern = 'SPLASHBASE64'
      return html
        .replace(csspattern, style)
        .replace(splashpattern, base64)
    })
}

router.use(express.static(path.join(__dirname, '../dist'), {index: '_'}))
router.use(express.static(path.join(__dirname, '../static')))

// show index.html as default response to GET requests
router.get('/', (req, res) => {
  fs.readFile(index_html_path, 'utf8', (err, html) => {
    if (err)
      res.status(500).json({message: err.toString()})
    else {
      attachPageTitle(html)
        .then(html => {
          return attachSplashStyles(html)
        })
        .then(html => {
          res.type('html')
          res.send(html)
        })
        .catch(err => {
          console.log(err)
          res.status(500).json({message: err.toString()})
        })
    }
  })
})

module.exports = router




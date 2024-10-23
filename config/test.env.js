'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  ROOT_API: '"http://172.22.1.51:8001/serviciosMEM/public/"'
})

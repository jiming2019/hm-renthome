const express = require('express')
const app = express()

app.use(express.static('build'))

app.listen(8888, () => {
  console.log('running...')
})
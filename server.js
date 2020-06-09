const express = require('express')
const config = require('./config')
const path = require('path')
const https = require('https')

let app = express()

app.use(express.static(path.join(__dirname, "public")))

app.get('/rate', (req, res) => {
    let { base, quote } = req.query

    if (!base || !quote) {
        res.status(400).send('no base or quote provided')
    }
    let data = ''

    base = base.toUpperCase()
    quote = quote.toUpperCase()
    https.get(`${config.api_link}from_currency=${base}&to_currency=${quote}&apikey=${config.api_key}`, (resp) => {
        resp.on('data', (chunck) => {
            data += chunck
        })

        resp.on('end', () => {
            try {
                res.status(200).send(`${JSON.parse(data)["Realtime Currency Exchange Rate"]["5. Exchange Rate"]}`)
            } catch {
                res.status(400).send('error while fetching api')
            }
        })
    }).on('error', (err) => {
        res.status(400).send(`${err}`)
    })
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"))
})

app.listen(3000, () => {
    console.log('App launched on localhost:3000')
})
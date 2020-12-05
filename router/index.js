const express = require('express')
const app = express()
const request = require('../controller/handle');
const logger = require('../util/logger.js');



app.post('/getBookById',async (req, res) => {
    try {
        logger.debug(req.body)
        var result = await new request().queryBookById(req.body)
        logger.debug(result.message)
        //res.status(result.status_code).json(result.message)
        res.json(result.message)
    } catch (error) {
        let messageError = {
            statusCode: error.statusCode ||  400,
            message: error.message || error
        }
        res.status(messageError.statusCode)
        res.json(messageError)
    }
})

app.post('/getHistory',async (req, res) => {
    try {
        logger.debug(req.body)
        var result = await new request().queryHistory(req.body)
        logger.debug(result.message)
        //res.status(result.status_code).json(result.message)
        res.json(result.message)
    } catch (error) {
        let messageError = {
            statusCode: error.statusCode ||  400,
            message: error.message || error
        }
        res.status(messageError.statusCode)
        res.json(messageError)
    }
})

app.post('/addBook',async (req, res) => {
    try {
        logger.debug(req.body)
        var result = await new request().addBook(req.body)
        logger.debug(result.message)
        //res.status(result.status_code).json(result.message)
        res.json(result.message)
    } catch (error) {
        let messageError = {
            statusCode: error.statusCode ||  400,
            message: error.message || error
        }
        res.status(messageError.statusCode)
        res.json(messageError)
    }
})

app.post('/addMember',async (req, res) => {
    try {
        logger.debug(req.body)
        var result = await new request().addMember(req.body)
        logger.debug(result.message)
        //res.status(result.status_code).json(result.message)
        res.json(result.message)
    } catch (error) {
        let messageError = {
            statusCode: error.statusCode ||  400,
            message: error.message || error
        }
        res.status(messageError.statusCode)
        res.json(messageError)
    }
})

app.post('/borrowBook',async (req, res) => {
    try {
        logger.debug(req.body)
        var result = await new request().borrowBook(req.body)
        logger.debug(result.message)
        //res.status(result.status_code).json(result.message)
        res.json(result.message)
    } catch (error) {
        let messageError = {
            statusCode: error.statusCode ||  400,
            message: error.message || error
        }
        res.status(messageError.statusCode)
        res.json(messageError)
    }
})

app.post('/returnBook',async (req, res) => {
    try {
        logger.debug(req.body)
        var result = await new request().returnBook(req.body)
        logger.debug(result.message)
        //res.status(result.status_code).json(result.message)
        res.json(result.message)
    } catch (error) {
        let messageError = {
            statusCode: error.statusCode ||  400,
            message: error.message || error
        }
        res.status(messageError.statusCode)
        res.json(messageError)
    }
})







module.exports = app
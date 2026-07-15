import express from 'express';
import dotenv from 'dotenv';

import soldiersRouter from './routes/soldierRouter.js'

const logger = (req, res, next) => {
    console.log(`${req.method} | ${req.url}`)
    next()
}

const errorHandler = (err, req, res, next) => {
    !err.statusCode? console.error(err.stack) : console.error(err.message)

    const statusCode = err.statusCode || 500

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Inernal server error',

})
}

const app = express()

app.use(express.json())
app.use(logger)
app.use('/soldiers', soldiersRouter)
app.use(errorHandler)

app.listen(process.env.APP_PORT, () => {
    console.log(`App is running on port ${process.env.APP_PORT}`)
})
import express from 'express';
import dotenv from 'dotenv';

import soldiersRouter from './routes/soldierRouter.js'

const errorHandler = (err, req, res, next) => {
    console.error(err.stack)

    const statusCode = err.statusCode || 500

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Inernal server error',

})
}

const app = express()

app.use(express.json())
app.use(soldiersRouter)
app.use('/soldiers', errorHandler)

app.listen(process.env.APP_PORT, () => {
    `App is running on port ${process.env.APP_PORT}`
})
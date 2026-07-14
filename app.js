import express from 'express';
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
app.use(errorHandler)
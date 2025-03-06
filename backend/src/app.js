import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app= express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"32kb"}))
app.use(express.urlencoded({extended:true,limit:"32kb"}))
app.use(express.static("public"))
app.use(cookieParser())


import userRoute from './routes/user.routes.js'
app.use("/api/v1/users",userRoute);

import foodItemRoute from './routes/foodItem.routes.js'
app.use("/api/v1/foodItem",foodItemRoute);

import recommendationRoute from './routes/recommendation.routes.js'
app.use("/api/v1/recommendation",recommendationRoute);

import mealRoute from './routes/meal.routes.js'
app.use("/api/v1/meal",mealRoute);

import feedbackRoute from './routes/feedback.routes.js'
app.use("/api/v1/feedback",feedbackRoute);

export {app}
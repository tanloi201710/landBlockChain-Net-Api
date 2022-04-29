
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// routers
const adminRoute = require('./routes/admin')
const userRoute = require('./routes/user')
const authRoute = require('./routes/auth')
const landRoute = require('./routes/land')
const managerRoute = require('./routes/manager')

// CORS 
const whitelist = [
  'http://localhost:3000',
]

const corsOptions = {
  origin: whitelist
}
app.use(cors(corsOptions))

app.use('/api/admin', adminRoute)
app.use('/api/manager', managerRoute)
app.use('/api/user', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/land', landRoute)




app.listen(5000, () => console.log("Server started with port 5000"));












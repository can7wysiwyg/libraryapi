require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port  = process.env.PORT || 5500
const cookieParser = require('cookie-parser')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const AdminRoute = require('./admin/AdminRoute')
const MainAdminRoute = require('./admin/MainAdminRoute')
const UserRoute = require('./users/UserRoute')
const BorrowRoute = require('./users/BorrowRoute')
const GenreRoute = require('./admin/GenreRoute')
const BookRoute = require('./routes/BooksRoute')
const CardRoute = require('./routes/CardRoute')
const AuthorRoute = require('./admin/AuthorRoute')


mongoose.connect(process.env.MONGO_DEVT_URL)

const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function(){
    console.log("connected to database");
  });


  app.use(cors())

  
  app.use(express.json({limit: '50mb'}))
  app.use(express.urlencoded({extended: true, limit: '50mb'}))
  app.use(cookieParser())
  app.use(fileUpload({
    useTempFiles: true
}))
  

// apis

app.use(AdminRoute)
app.use(MainAdminRoute)
app.use(UserRoute)
app.use(BorrowRoute)
app.use(GenreRoute)
app.use(BookRoute)
app.use(CardRoute)
app.use(AuthorRoute)



app.listen(port, () => {
    console.log(`Your server is now running on port ${port}`);
})

const jwt = require('jsonwebtoken');
const BorrowRoute = require('express').Router();
const Card = require('../models/CardModel');
const verify = require('../middleware/verify');
const ableToBorrow = require('../middleware/ableToBorrow');
const asyncHandler = require('express-async-handler');
const ScheduledTask = require('../models/ScheduleTaskModel')
const UserBorrowedBook = require('../models/PreviousUserBorrowedBookModel')


const bookAccessToken = (horcrux) => {
  return jwt.sign(horcrux, process.env.BOOK_ACCESS_TOKEN, { expiresIn: '30d' });
};

const getAccessTokenFromDB = async (userId) => {
  try {
    const accessToken = await Card.findOne({ borrower: userId } , {}, { sort: { createdAt: -1 } });
    return accessToken ? accessToken.token : null;
  } catch (error) {
    throw new Error('Error fetching access token from the database.');
  }
};




const canBorrow = async (req, res, next) => {
  const { id } = req.params;
  const accessToken = await getAccessTokenFromDB(id);

  try {
  
    const decodedAccessToken = jwt.verify(accessToken, process.env.BOOK_ACCESS_TOKEN);

    
    const userHasBorrowedBooks = await Card.exists({ borrower: id, hasBorrowedBooks: true });
    if (userHasBorrowedBooks && decodedAccessToken) {
      return res.json({ msg: "cannot borrow" });
    }

    
    next();
  } catch (error) {
    
    next();
  }
};



BorrowRoute.post('/borrow/borrow_books/:id', verify, ableToBorrow, canBorrow, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { bookOne, bookTwo, bookThree, borrower } = req.body;
  const ccessToken = bookAccessToken({ books: [bookOne, bookTwo, bookThree], borrower });

  if(!bookOne) res.json({msg: "there should be at least be a book.."}) 

  try {
    
  const items = await Card.create({
      bookOne,
      bookTwo,
      bookThree,
      borrower: id,
      token: ccessToken,
      hasBorrowedBooks: true,  
    });


   
    let newId = items._id

    let BookOne = items.bookOne
    let BookTwo = items.bookTwo
    let BookThree = items.bookThree
    let Borrower = items.borrower



    await UserBorrowedBook.create({
      BookOne,
      BookTwo,
      BookThree,
      Borrower

    })

    ruCode(newId)
  
    

    res.json({ msg: 'Successfully borrowed' });
  } catch (error) {
    return res.status(500).json({ msg: 'Error creating card.' });
  }
}));

async function ruCode(hmm) {
  try {
    
    const existingTask = await ScheduledTask.findOne({ cardId: hmm });
    if (existingTask) {
      console.log(`Card with ID ${hmm} is already scheduled for deletion.`);
      return;
    }

    
    
    const newTask = new ScheduledTask({ cardId: hmm });
    await newTask.save();

    
   
        } catch (error) {
    console.error('Error occurred:', error);
  }
}




async function startScheduledTasks() {
  try {
    const scheduledTasks = await ScheduledTask.find({});

    for (const task of scheduledTasks) {
      ruCode(task.cardId);

      const mongodbDate = new Date(task.createdAt);
      const normalDate = new Date(mongodbDate.toISOString());

      // console.log(normalDate);

      const newDate = new Date(normalDate.getTime() + 2592000000); // 2592000000 milliseconds = 30 days

      if (newDate < Date.now()) {
        await Card.findOneAndDelete(task.cardId);
        console.log(`Successfully deleted card with ID: ${task.cardId}`);
        await ScheduledTask.findByIdAndDelete(task._id)
      } else {
        console.log("30 days have not passed since the creation date.");
        
      }
    }

    console.log(1);
  } catch (error) {
    console.error('Error occurred while starting scheduled tasks:', error);
  }
}


setInterval(startScheduledTasks, 60000);






module.exports = BorrowRoute;
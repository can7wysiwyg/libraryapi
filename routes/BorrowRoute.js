const jwt = require('jsonwebtoken');
const BorrowRoute = require('express').Router();
const Card = require('../models/CardModel');
const verify = require('../middleware/verify');
const ableToBorrow = require('../middleware/ableToBorrow');
const asyncHandler = require('express-async-handler');


const bookAccessToken = (horcrux) => {
  return jwt.sign(horcrux, process.env.BOOK_ACCESS_TOKEN, { expiresIn: '30d' });
};

const getAccessTokenFromDB = async (userId) => {
  try {
    const accessToken = await Card.findOne({ borrower: userId }, {}, { sort: { createdAt: -1 } });
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

  try {
    
    Card.create({
      bookOne,
      bookTwo,
      bookThree,
      borrower: id,
      token: ccessToken,
      hasBorrowedBooks: true,
    });

    res.json({ msg: 'Successfully borrowed' });
  } catch (error) {
    return res.status(500).json({ msg: 'Error creating card.' });
  }
}));












module.exports = BorrowRoute;
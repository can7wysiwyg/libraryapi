const jwt = require('jsonwebtoken');
const BorrowRoute = require('express').Router();
const Card = require('../models/CardModel');
const verify = require('../middleware/verify');
const ableToBorrow = require('../middleware/ableToBorrow');
const asyncHandler = require('express-async-handler');

const bookAccessToken = (horcrux) => {
  return jwt.sign(horcrux, process.env.BOOK_ACCESS_TOKEN, { expiresIn: '30d' });
};

const createRefreshToken = (horcrux) => {
  return jwt.sign(horcrux, process.env.BOOK_REFRESH_TOKEN, { expiresIn: '30d' });
};

const getAccessTokenFromDB = async (userId) => {
  try {
    const card = await Card.findOne({ borrower: userId });
    return card ? card.token : null;
  } catch (error) {
    throw new Error('Error fetching access token from the database.');
  }
};


BorrowRoute.post('/borrow/borrow_books', verify, ableToBorrow, asyncHandler(async (req, res, next) => {
  try {
    const { bookOne, bookTwo, bookThree, borrower } = req.body;

    
    const accessToken = bookAccessToken({ books: [bookOne, bookTwo, bookThree], borrower });

    
    
    const card = await Card.create({
      bookOne,
      bookTwo,
      bookThree,
      borrower,
      token: accessToken,
    });

    
    res.json({ msg: 'Successfully borrowed',  });

  } catch (error) {
    next(error);
  }
}));


BorrowRoute.get('/borrow/view_book/:id', verify, ableToBorrow, asyncHandler(async (req, res, next) => {
  try {
    const {id} = req.params

  
    const accessToken = await getAccessTokenFromDB(id);

    if (!accessToken) {
      return res.status(401).json({ msg: 'Access token not found in the database.' });
    }

    
    jwt.verify(accessToken, process.env.BOOK_ACCESS_TOKEN, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ msg: 'Invalid or expired token.' });
      }

    
      const nowInSeconds = Math.floor(Date.now() / 1000);
      if (decoded.exp < nowInSeconds) {
        return res.status(403).json({ msg: 'Token has expired.' });
      }

      
      const card = await Card.findOne({ borrower: id });

      if (!card) {
        return res.status(404).json({ msg: 'No borrowed books found for the user.' });
      }

      
      res.json({ card });
    });

  } catch (error) {
    next(error);
  }
}));





module.exports = BorrowRoute;

const jwt = require('jsonwebtoken');
const BorrowRoute = require('express').Router();
const Card = require('../models/CardModel');
const verify = require('../middleware/verify');
const ableToBorrow = require('../middleware/ableToBorrow');
const asyncHandler = require('express-async-handler');


const bookAccessToken = (horcrux) => {
  return jwt.sign(horcrux, process.env.BOOK_ACCESS_TOKEN, { expiresIn: '1min' });
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

const express = require('express')
const uuid = require('uuid/v4')
const logger = require('../logger')

const bookmarkRouter = express.Router()
const bodyParser = express.json()

const bookmarks = [
  {
    id: 1,
    title: 'Apple Inc',
    url: 'https://www.apple.com',
    description: 'Lorem ipsum lorem ipsum',
    rating: 5
  },
  {
    id: 2,
    title: 'Site Inspire',
    url: 'https://www.siteinspire.com',
    description: 'Lorem ipsum lorem ipsum',
    rating: 4
  }
]

bookmarkRouter
  .route('/bookmarks')
  .get((req, res) => {
    return res
      .status(200)
      .json(bookmarks)
  })
  .post(bodyParser, (req, res) => {
    const { title, description, url, rating } = req.body;

    if (!title) {
      logger.error('Title is required')
      return res
        .status(400)
        .send('Invalid data')
    }
    if (!description) {
      logger.error('Description is required');
      return res
        .status(400)
        .send('Invalid data')
    }
    if (!url) {
      logger.error('URL is required')
      return res
        .status(400)
        .send('Invalid data')
    }
    if (!rating) {
      logger.error('Rating is required')
      return res
        .status(400)
        .send('Invalid data')
    }
    if (rating < 1 || rating > 5) {
      logger.error('Rating must be between 1 and 5 stars')
      // adding some extra validation just in case
      return res
        .status(400)
        .send('Rating must be between 1 and 5 stars')
    }
    const id = uuid();

    const bookmark = {
      id,
      title,
      description,
      url,
      rating
    }

    bookmarks.push(bookmark)
    logger.info(`Card with id ${id} created`)

    res
      .status(201)
      .location(`http://localhost:8000/bookmark/${id}`)
      .json(bookmark)

  })

bookmarkRouter
  .route('/bookmarks/:id')
  .get((req, res, next) => {
    const { id } = req.params
    const bookmark = bookmarks.find(b => b.id == id)
    // find the bookmark where the id matches the id from the params

    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found.`)
      return res
        .status(404)
        .send('Bookmark not found')
    }
    res.json(bookmark)
  })
  .delete(bodyParser, (req, res) => {
    const { id } = req.params;
    const listIndex = bookmarks.findIndex(book => book.id == id)

    // if the id isn't found
    if (listIndex === -1) {
        logger.error(`Bookmark with id ${id} not found`)
        return res
          .status(404)
          .send('Not found')
    }
    // removes from the array
    bookmarks.splice(listIndex, 1);

    logger.info(`Bookmark with id ${id} deleted`)
    res
      .status(204)
      .end();
  })

module.exports = bookmarkRouter;

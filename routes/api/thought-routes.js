const router = require('express').Router();
const {
  createThought,
  getAllThoughts,
  getSingleThought,
  updateThought,
  removeThought,
  addReaction,
  removeReaction
} = require('../../controllers/thought-controller');

router.route('/').get(getAllThoughts).post(createThought);

router.route('/:id').get(getSingleThought).put(updateThought).delete(removeThought);

router.route('/:id/reactions').post(addReaction).delete(removeReaction);

module.exports = router;
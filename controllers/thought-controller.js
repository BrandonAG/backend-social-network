const { Thought, User } = require('../models');

const thoughtController = {
  // get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .select('-__v')
      .sort({ _id: -1 })
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // get one thought by id
  getSingleThought({ params }, res) {
    Thought.findOne({ _id: params.id })
      .populate(
        {
          path: 'reactions',
          select: '-__v'
        }
      )
      .select('-__v')
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // create thought
  createThought({ body }, res) {
    console.log(body.username)
    User.findOne({ username: body.username })
      .select('-__v')
      .then((dbUserData) => 
      {
        if (!dbUserData) {
          res.status(404).json({ message: '/No user found with this username!' });
          return;
        }
        Thought.create(body)
          .then(dbThoughtData => 
            {
              User.findOneAndUpdate(
                { username: dbThoughtData.username },
                { $push: { thoughts: dbThoughtData._id } },
                { runValidators: true }
              )
              .then(dbUserData => {
                if (!dbUserData) {
                  res.status(404).json({ message: '//No user found with this username!' });
                  return;
                }
                res.json(dbUserData);
              })
              .catch(err => res.json(err));
              res.json(dbThoughtData)
            }
          )
          .catch(err => res.json(err));
      })
      .catch(err => {
        console.log(err);
        res.status(404).json({ message: '///No user found with this username!' });
        return false;
      });
  },

  // update thought by id
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.json(err));
  },

  // delete thought
  removeThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then(dbThoughtData => 
        {
          User.findOneAndUpdate(
            { username: dbThoughtData.username },
            { $pull: { thoughts: dbThoughtData._id } },
            { runValidators: true }
          )
          .then(dbUserData => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this username!' });
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => res.json(err));
          res.json(dbThoughtData)
        })
      .catch(err => res.json(err));
  },

  // add reaction by thought id
  addReaction({ params, body }, res) {;
    Thought.findOneAndUpdate(
      { _id: params.id },
      { $push: { reactions: body } },
      { runValidators: true, new: true }
    )
    .populate(
      {
        path: 'reactions',
        select: '-__v'
      }
    )
    .select('-__v')
    .then(dbThoughtData => {
      console.log("//AA");
      if (!dbThoughtData) {
        res.status(404).json({ message: 'No thought found with this id!' });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => res.json(err));
  },

  // delete reaction by thought id
  removeReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.id },
      { $pull: { reactions: body } },
      { new: true }
      )
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.json(err));
  }
};

module.exports = thoughtController;

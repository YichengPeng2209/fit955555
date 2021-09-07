const { ObjectId } = require('bson');
const mongoose = require('mongoose');


const Actor = require('../modules/actors');
const Movie = require('../modules/movies');

module.exports = {

    getAll: function (req, res) {
        Actor.find().populate("movies").exec(function (err, actors) {
            if (err) {
                return res.status(404).json(err);
            } else {
                res.json(actors);
            }
        });
    },

    createOne: function (req, res) {
        let newActorDetails = req.body;
        newActorDetails._id = new mongoose.Types.ObjectId();

        let actor = new Actor(newActorDetails);
        actor.save(function (err) {
            res.json(actor);
        });
    },

    getOne: function (req, res) {
        Actor.findOne({ _id: req.params.id })
            .populate('movies')
            .exec(function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                res.json(actor);
            });
    },


    updateOne: function (req, res) {
        Actor.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();

            res.json(actor);
        });
    },


    deleteOne: function (req, res) {
        Actor.findOneAndRemove({ _id: req.params.id }, function (err) {
            if (err) return res.status(400).json(err);

            Movie.findByIdAndDelete({actors:[{"_id":req.params.id}]},function(err)
            {
                if (err) return res.status(400).json(err);
            })
            res.json();
        });

    },

    removeMovie: function(req,res)
    {
        Actor.findOne({_id:req.params.aid},function(err,actor)
        {
            Movie.findOne({_id:req.params.mid},function(err,movie)
            {
                for(let i = 0;i<actor.movies.length;i++)
                {
                    if(actor.movies[i]._id == req.params.mid)
                    {
                        actor.movies.splice(i,1);
                        actor.save(function(err)
                        {
                            if (err) return res.status(500).json(err);
                            res.json(actor);
                        });
                    }
                }

            });
        });
    },


    addMovie: function (req, res) {
        Actor.findOne({ _id: req.params.id }, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();

            Movie.findOne({ _id: req.body.id }, function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();

                actor.movies.push(movie._id);
                actor.save(function (err) {
                    if (err) return res.status(500).json(err);

                    res.json(actor);
                });
            })
        });
    }
};
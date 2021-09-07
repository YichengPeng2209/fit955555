const Actor = require('../modules/actors');
const Movie = require('../modules/movies');
const mongoose = require('mongoose');
const movies = require('../modules/movies');

module.exports = {

    getAll: function (req, res) {
        Movie.find().populate('actors').exec(function (err, movies) {
            if (err) return res.status(400).json(err);

            res.json(movies);
        });
    },


    createOne: function (req, res) {
        let newMovieDetails = req.body;
        newMovieDetails._id = new mongoose.Types.ObjectId();
        Movie.create(newMovieDetails, function (err, movie) {
            if (err) return res.status(400).json(err);

            res.json(movie);
        });
    },


    getOne: function (req, res) {
        Movie.findOne({ _id: req.params.id })
            .populate('actors')
            .exec(function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();

                res.json(movie);
            });
    },

    removeActor: function(req,res){
        Movie.findOne({_id:req.params.mid},function(err,movie)
        {
            Actor.findOne({_id:req.params.aid},function(err,actor)
            {
                for(let i = 0;i<movie.actors.length;i++)
                {
                    if(movie.actors[i]._id == req.params.aid)
                    {
                        movie.actors.splice(i,1);
                        movie.save(function(err)
                        {
                            if (err) return res.status(500).json(err);
                            res.json(movie);
                        });
                    }
                }

            });
        });

    },

    deleteMovies:function(req,res)
    {
        console.log(req.body.year1);
        console.log(req.body.year2);
        Movie.deleteMany({"year":{$gte:parseInt(req.body.year1),$lte:parseInt(req.body.year2)}},function(err,movies){
            if (err) return res.status(400).json(err);
            res.json(movies);
        });
    },


    updateOne: function (req, res) {
        Movie.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();

            res.json(movie);
        });
    },


    addActor:function(req,res)
    {
        Movie.findOne({ _id: req.params.id }, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();

            Actor.findOne({ _id: req.body.id }, function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();

                movie.actors.push(actor._id);
                movie.save(function (err) {
                    if (err) return res.status(500).json(err);

                    res.json(movie);
                });
            });
        });
    },

    getMoviesByYear:function(req,res)
    {
        Movie.where('year').gte(req.params.y1).lte(req.params.y2)
            .populate('actors')
            .exec(function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();

                res.json(movie);
            });
    },

    deleteOne: function (req, res) {
        Movie.findOneAndRemove({ _id: req.params.id }, function (err) {
            if (err) return res.status(400).json(err);

            res.json();
        });
    },
};
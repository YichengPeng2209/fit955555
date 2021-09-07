const express = require('express');
const mongoose = require('mongoose');

const actors = require('./routes/actorRoute');
const movies = require('./routes/movieRoute');

const app = express();

app.listen(8080);


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect('mongodb://'+process.argv[2]+':27017/FIT2095Week7', function (err) {
    if (err) {
        return console.log('Mongoose - connection error:', err);
    }
    console.log('Connect Successfully');

});

//Configuring Endpoints
//Actor RESTFul endpoionts 
app.get('/actors', actors.getAll);
app.post('/actors', actors.createOne);
app.get('/actors/:id', actors.getOne);
app.put('/actors/:id', actors.updateOne);
app.post('/actors/:id/movies', actors.addMovie);
app.delete('/actors/:id', actors.deleteOne);
app.put('/actors/:aid/:mid',actors.removeMovie);


//Movie RESTFul  endpoints
app.get('/movies', movies.getAll);
app.post('/movies', movies.createOne);
app.get('/movies/:id', movies.getOne);
app.get('/movies/:y1/:y2',movies.getMoviesByYear);
app.put('/movies/:id', movies.updateOne);
app.delete('/movies/:id',movies.deleteOne);
app.put('/movies/:mid/:aid',movies.removeActor);
app.post('/movies/:id/actor',movies.addActor);
app.post('/movies/delete',movies.deleteMovies);

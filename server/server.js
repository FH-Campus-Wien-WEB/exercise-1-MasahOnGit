const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'files')));

app.get('/movies', async function (req, res) {
    try {
        const apiKey = 'e3a1f2a7';
        const movieTitles = ['Tenet', 'Inception', 'Interstellar'];
        const movies = [];

        for (const title of movieTitles) {
            const response = await fetch(`http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`);
            const data = await response.json();

            if (data.Response === 'True') {
                movies.push({
                    Title: data.Title,
                    Released: data.Released === 'N/A' ? 'Date unknown' : data.Released,
                    Runtime: parseInt(data.Runtime) || 0,
                    Genres: data.Genre ? data.Genre.split(', ') : [],
                    Directors: data.Director ? data.Director.split(', ') : [],
                    Writers: data.Writer ? data.Writer.split(', ') : [],
                    Actors: data.Actors ? data.Actors.split(', ') : [],
                    Plot: data.Plot,
                    Poster: data.Poster,
                    Metascore: parseInt(data.Metascore) || 0,
                    imdbRating: parseFloat(data.imdbRating) || 0
                });
            }
        }
        res.json(movies);
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({error: error.message});
    }
});


app.listen(port, () => {
    console.log(`Server now listening on http://localhost:${port}/`);
});
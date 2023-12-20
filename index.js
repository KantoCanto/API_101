import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = 3000;

//OPEN CAGE
const OPENCage_KEY = process.env.OPENCAGE_KEY;

async function getCoordinates(city, country) {
    try{
        const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${city},${country}&key=${OPENCage_KEY}`);
        if (response.data.results && response.data.results.length > 0) {
            const { lat, lng } = response.data.results[0].geometry;
            console.log(`Latitude: ${lat}, Longitude: ${lng}`);
            return { lat, lng };
        } else {
            console.log('No results found');
            return null;
        }
    }catch(error){
        console.log(error);
    }
}

//OPEN WEATHER
const OPENWeather_KEY = process.env.OPENWEATHER_KEY;   

async function getWeather(lat, lng) {
    try{
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${OPENWeather_KEY}&units=metric`);
        console.log(response.data);
        return response.data;
    }catch(error){
        console.log(error);
    }
}


app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); //sets the view engine to ejs

app.get('/', (req, res) => {
  res.render("index.ejs"); //renders the index.ejs file
});

app.get("/currentWeather", (req, res) =>{
    res.render("currentWeather.ejs");
})

app.post("/weather", async (req, res) => {
    const city = req.body.city;
    const country = req.body.country;
    console.log(city, country);
    const coordinates = await getCoordinates(city, country);
    if(coordinates){
        const result = await getWeather(coordinates.lat, coordinates.lng);
        res.render("currentWeather.ejs", {weather: result})
    }else{
        res.redirect("/");
    }
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }  
);


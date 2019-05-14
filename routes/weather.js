const router  = require('express').Router()
const weather = require('../controllers/weather_controller')

//show-weather
router.get('/show-weather', weather.getWeather)

//search-weather
router.post('/search', (req, res) => {
    let location = req.body.search
    weather.getWeatherByAddress(location)
        .then((result) => {
            res.status(200).send({
                status: 'oke',
                data: result,
                message: 'success get data',
            })
        }).catch((e) => {
            res.status(400).send({
                status: 'error',
                data: [],
                message: 'failed getting data',
            })
        })
});

module.exports = router
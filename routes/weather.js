const router  = require('express').Router()
const weather = require('../controllers/weather_controller')

//show-weather
router.get('/show-weather', weather.getWeather)

//search-weather
router.put('/search', weather.getSearchWeather)

module.exports = router
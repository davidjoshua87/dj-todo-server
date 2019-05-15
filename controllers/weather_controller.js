const weatherJs = require('weather-js');

module.exports = {
    getSearchWeather: function (req, res) {
        let searchAddress = req.body.search;

        weatherJs.find({
            search: searchAddress,
            degreeType: 'C'
        }, function (err, result) {

            if (err) {
                res.status(400).json({
                    message: err
                });
            } else {
                res.status(200).json({
                    message: "success setting data",
                    data: result[0]
                })
            }
        });
    },

    getWeather: function (req, res) {
        weatherJs.find({
            search: 'Jakarta',
            degreeType: 'C'
        }, function (err, result) {

            if (err) {
                res.status(400).json({
                    message: err
                });
            } else {
                res.status(200).json({
                    message: "success setting data",
                    data: result[0]
                })
            }
        });
    },
}
/**
 * Your task is to complete the async weather.loadWeather function for Node.js below.
 *
 * You'll need to find an API to return the current weather for a set of coords
 * http://forecast.io is one option
 *
 * This function should do the following:
 * 1. Use the provided weather.getLocation method to retrieve a random set of coordinates
 * 2. Call your chosen weather API to retrieve the current weather for those coordinates
 * 3. Call the callback function passing appropriate values for err and res
 *
 * Some rules:
 * - You must not modify the provided getLocation method or the final call to loadWeather
 *   (no matter how badly written they are)
 * - Adding methods to the weather object is fine, so is creating aditional objects
 * - loadWeather must not return a result and should instead use the passed callback
 * - No external dependencies!
 * - Ensure your code can be run with node v0.10.x
 *
 * Notes on callbacks:
 * - All callbacks should follow the Node.js standard method signature:
 *   function callback(error, result) { }
 *
 * Some things to consider:
 * - Error handling
 * - Optimisation
 *
 * Your submission will be tested as a single file run with node v10.x
 */
 
 var https = require('https');
 
/**
 * This is my preferred way of defining objects as it allows me 
 * to define private methods and properties. This is due to the fact 
 * JavaScript only has function scope.
 * This approach is recommended by Douglas Crocford: http://javascript.crockford.com/private.html
 */
function ForecastIOService () {
  
  var that = this;
  var apiKey = "d719a7f9319370c35230f42e7c60e099";
  var baseUrl = "api.forecast.io";
  
  /**
   * Get forecast for coordinates
   *
   * Expects a latitude, a longitude and a callback function with the standard signature
   * - function(err, res) { }
   */
  this.forecast = function(latitude, longitude, callback) {
    var location = latitude + "," + longitude;
    var path = "/forecast/" + apiKey + "/" + location;
    
    var options = {
      host: baseUrl,
      path: path
    };

    var requestCallback = function(response) {
      var str = '';
      
      // appending chunks of data to str
      response.on('data', function (chunk) {
        str += chunk;
      });

      // the whole response has been received
      response.on('end', function () {
        callback(null, JSON.parse(str).currently);
      });
    };

    var requestErrorCallback = function(err) {
      callback(err, null);
    };

    var request = https.get(options, requestCallback)
      .on('error', requestErrorCallback).end();
    
  };

};

var weather = {

  /**
   * Get coordinates for a random location
   *
   * Expects a callback function with the standard signature
   * - function(err, res) { }
   * 
   * A successful result is an array of the form: [lat, long]
   *
   * DO NOT MODIFY
   */
  getLocation: function(c) {
    var l=[[51.507, -0.127],[55.676, 12.568],[]]
      , i=Math.round(Math.random()*3);
    (i<3) ? c(null,l[i]) : c("Fail",null);
  },
 
 
  /**
   * Load weather from an external data source and log the results
   */
  loadWeather: function(callback) {
    var that = this;
    this.getLocation(function(error, location) {
      var err = that.getLocationErrorMessage(error, location);
      var res;
      
      if (err) {
      	callback(err, res);
      	return;
      }
      
      var service = new ForecastIOService();
      var latitude = location.shift();
      var longitude = location.shift();
      service.forecast(latitude, longitude, callback);
    });
  },
  
  getLocationErrorMessage: function(error, location) {
    var err;
    
    if (error) {
      err = "getLocation() failed";
    } else if (!location || 2 !== location.length) {
      err = "getLocation() did not return valid coordinates";
    }
    
    return err;
  }
 
};
 
 
/**
 * This is how we'll use the function when testing.
 *
 * DO NOT MODIFY
 */
weather.loadWeather(function(err, res) {
  if (err) return console.log("Error: " + err);
  console.log(res);
});

'use strict';
console.log("Loading Activity.services");

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [ 'ngResource' ])
.value('version', '0.1')
.factory(
    'MostRecentActivities',
    function($http) {
      return {
        'async' : function() {
          var promise = $http
              .get(
                  'https://ifielddevs.iriscouch.com/lingllama-cherokee-activity_feed/'
                      + '_design/activities/_view/all?limit=5&decending=true').then(
                  function(response) {
                    // + JSON.stringify(response));
                     console.log("response", response);
                    return response.data.rows;
                  });
          return promise;
        }
      };
    });
'use strict';

angular.module('jhipsterApp')
    .factory('Account', function Account($resource) {
        return $resource('user', {}, {
            'get': { method: 'GET', params: {}, isArray: false,
                interceptor: {
                    response: function(response) {
                        // expose response
                        return response;
                    }
                }
            }
        });
    });

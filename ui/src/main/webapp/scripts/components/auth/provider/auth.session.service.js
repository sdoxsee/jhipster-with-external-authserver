'use strict';

angular.module('jhipsterApp')
    .factory('AuthServerProvider', function loginService($http, localStorageService, $window) {
        return {
            login: function(credentials) {
                var data = 'j_username=' + encodeURIComponent(credentials.username) +
                    '&j_password=' + encodeURIComponent(credentials.password) +
                    '&remember-me=' + credentials.rememberMe + '&submit=Login';
                return $http.post('api/authentication', data, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function (response) {
                    return response;
                });
            },
            logout: function() {
                // logout from the server
                $http.post('/logout').success(function (response) {
                    localStorageService.clearAll();
                    // to get a new csrf token call the api
                    $http.get('/user');
                    return response;
                }).error(function(data) {
                  localStorageService.clearAll();
                  // to get a new csrf token call the api
                  $http.get('/user');
                  return data;
                });
            },
            getToken: function () {
                var token = localStorageService.get('token');
                return token;
            },
            hasValidToken: function () {
                var token = this.getToken();
                return !!token;
            }
        };
    });

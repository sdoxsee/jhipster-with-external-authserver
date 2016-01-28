'use strict';

angular.module('jhipsterApp', ['LocalStorageModule', 'tmh.dynamicLocale', 'pascalprecht.translate',
    'ngResource', 'ngCookies', 'ngAria', 'ngCacheBuster', 'ngFileUpload',
    // jhipster-needle-angularjs-add-module JHipster will add new module
    'ui.bootstrap', 'ui.router',  'infinite-scroll', 'angular-loading-bar'])

    .run(function ($rootScope, $location, $window, $http, $state, $translate, localStorageService, Language, Auth, Principal, ENV, VERSION) {
        // update the window title using params in the following
        // precendence
        // 1. titleKey parameter
        // 2. $state.$current.data.pageTitle (current state page title)
        // 3. 'global.title'
        var updateTitle = function(titleKey) {
            if (!titleKey && $state.$current.data && $state.$current.data.pageTitle) {
                titleKey = $state.$current.data.pageTitle;
            }
            $translate(titleKey || 'global.title').then(function (title) {
                $window.document.title = title;
            });
        };

        $rootScope.ENV = ENV;
        $rootScope.VERSION = VERSION;
        $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams, fromState, fromParams) {
            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;

            // catch the case where we've just loaded the angular app but there is
            // a previousStateName in localStorage that we should go to.
            if (!fromState.name && localStorageService.get('previousStateName')) {
              event.preventDefault();
              var previousState = localStorageService.get('previousStateName');
              localStorageService.set('previousStateName', undefined);
              localStorageService.set('previousStateParams', undefined);
              $state.go(previousState);
            }

            if (toState.external) {
              event.preventDefault();
              $window.open(toState.url, '_self');
            }

            if (Principal.isIdentityResolved()) {
                Auth.authorize();
            }

            // Update the language
            Language.getCurrent().then(function (language) {
                $translate.use(language);
            });

        });

        $rootScope.$on('$stateChangeSuccess',  function(event, toState, toParams, fromState, fromParams) {
            var titleKey = 'global.title' ;

            // Set the page title key to the one configured in state or use default one
            if (toState.data.pageTitle) {
                titleKey = toState.data.pageTitle;
            }
            updateTitle(titleKey);
        });

        // if the current translation changes, update the window title
        $rootScope.$on('$translateChangeSuccess', function() { updateTitle(); });


        $rootScope.back = function() {
            // If previous state is 'activate' or do not exist go to 'home'
            var previousStateName = localStorageService.get('previousStateName');
            var previousStateParams = localStorageService.get('previousStateParams');
            if (previousStateName === 'activate' || $state.get(previousStateName) === null) {
                $state.go('home');
            } else {
                $state.go(previousStateName, previousStateParams);
            }
        };
    })
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider, $translateProvider, tmhDynamicLocaleProvider, httpRequestInterceptorCacheBusterProvider, AlertServiceProvider) {
        // uncomment below to make alerts look like toast
        //AlertServiceProvider.showAsToast(true);

        //enable CSRF
        // $httpProvider.defaults.xsrfCookieName = 'CSRF-TOKEN';
        // $httpProvider.defaults.xsrfHeaderName = 'X-CSRF-TOKEN';

        //Cache everything except rest api requests
        httpRequestInterceptorCacheBusterProvider.setMatchlist([/.*api.*/, /.*protected.*/], true);

        $urlRouterProvider.otherwise('/');
        $stateProvider.state('site', {
            'abstract': true,
            views: {
                'navbar@': {
                    templateUrl: 'scripts/components/navbar/navbar.html',
                    controller: 'NavbarController'
                }
            },
            resolve: {
                authorize: ['Auth',
                    function (Auth) {
                        return Auth.authorize();
                    }
                ],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('global');
                }]
            }
        });

        $httpProvider.interceptors.push('errorHandlerInterceptor');
        $httpProvider.interceptors.push('authExpiredInterceptor');
        $httpProvider.interceptors.push('notificationInterceptor');

        // Initialize angular-translate
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: 'i18n/{lang}/{part}.json'
        });

        $translateProvider.preferredLanguage('en');
        $translateProvider.useCookieStorage();
        $translateProvider.useSanitizeValueStrategy('escaped');
        $translateProvider.addInterpolation('$translateMessageFormatInterpolation');

        tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
        tmhDynamicLocaleProvider.useCookieStorage();
        tmhDynamicLocaleProvider.storageKey('NG_TRANSLATE_LANG_KEY');

    })
    // jhipster-needle-angularjs-add-config JHipster will add new application configuration
    .config(['$urlMatcherFactoryProvider', function($urlMatcherFactory) {
        $urlMatcherFactory.type('boolean', {
            name : 'boolean',
            decode: function(val) { return val == true ? true : val == "true" ? true : false },
            encode: function(val) { return val ? 1 : 0; },
            equals: function(a, b) { return this.is(a) && a === b; },
            is: function(val) { return [true,false,0,1].indexOf(val) >= 0 },
            pattern: /bool|true|0|1/
        });
    }]);

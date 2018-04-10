'use strict';

angular.module('gecscf.user', [ 'ui.router', 'gecscf.ui' ]).config(
	[ '$stateProvider', function($stateProvider) {
	  var dependencies = [
	    'js/app/modules/user/controllers/UserListController.js',
	    'js/app/modules/user/controllers/UserOrganizeController.js',
      'js/app/modules/user/controllers/UserController.js',
      'js/app/modules/user/services/UserService.js',
      'js/app/common/scf-component.js',
      'js/app/common/scf-component.css'
    ];
	  $stateProvider.state('/settings/users', {
      url: '/settings/users',
      controller: 'UserListController',
      controllerAs: 'ctrl',
      templateUrl: '/user',
      params: {
        backAction: false,
        criteria: null,
        userListModel: null,
        mode: 'ALL'
      },
      resolve: WebHelper.loadScript(dependencies)
    }).state('/customer-registration/customer-users', {
      url: '/customer-registration/customer-users',
      controller: 'UserListController',
      controllerAs: 'ctrl',
      templateUrl: '/user',
      params: {
        backAction: false,
        criteria: null,
        userListModel: null,
        mode: 'CUSTOMER'
      },
      resolve: WebHelper.loadScript(dependencies)
    }).state('/user/new', {
      url: '/user/new',
      controller: 'UserController',
      controllerAs: 'ctrl',
      templateUrl: '/user/new',
      params: {
        mode: 'newUser',
        userModel: null
      },
      resolve: WebHelper.loadScript(dependencies)
    }).state('/user/edit', {
      url: '/user/edit',
      controller: 'UserController',
      controllerAs: 'ctrl',
      templateUrl: '/user/new',
      params: {
        mode: 'editUser',
        userModel: null
      },
      resolve: WebHelper.loadScript(dependencies)
    }).state('/user/view', {
      url: '/user/view',
      controller: 'UserController',
      controllerAs: 'ctrl',
      params: {
        mode: 'viewUser',
        userModel: null
      },
      templateUrl: '/user/view',
      resolve: WebHelper.loadScript(dependencies)
    });
	} ]);
/**
 * Explore controller
 *
 * @class lorax/controllers/ExploreCtrl
 * @param $scope
 */
define([], function () {
  'use strict';

  /*jshint unused: false */
  var ExploreCtrl = function (
    $scope
  ) {

    this._$scope = $scope;

    console.log('load explore ctrl');
  };

  ExploreCtrl.$inject = [
    '$scope'
  ];

  return ExploreCtrl;
});
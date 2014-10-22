/**
 * @fileOverview Explore canvas directive
 * @author <a href="mailto:leandroferreira@moco.to">Leandro Ferreira</a>
 */
define(['threejs', 'stats', 'modernizr'], function (THREE, Stats, Modernizr) {
  'use strict';

  /**
   * directive
   */
  var ExploreCanvasDirective = function () {
    return {
      restrict: 'A',
      replace: true,
      controller: ExploreCanvasController,
      link: ExploreCanvasLinkFn,
      template: '<div id="explore"></div>'
    };
  };

  /**
   * Controller for explore canvas directive
   * @constructor
   */
  var ExploreCanvasController = function (
    $scope
    )
  {
    this._$scope = $scope;

    // this._explore = new Explore();
    // this._explore.init(true);
  };

  /**
   * Array of dependencies to be injected into controller
   * @type {Array}
   */
  ExploreCanvasController.$inject = [
    '$scope'
  ];

  /**
   * Link function
   * @param {object} scope      Angular scope.
   * @param {JQuery} iElem      jQuery element.
   * @param {object} iAttrs     Directive attributes.
   * @param {object} controller Controller reference.
   */
  var ExploreCanvasLinkFn = function (scope, iElem, iAttrs, controller) {
    var mouse = new THREE.Vector2();
    var intersected;
    var projector = new THREE.Projector();
    var raycaster = new THREE.Raycaster();
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

    var stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);

    var w = window.innerWidth;
    var h = window.innerHeight / 1.5;
    var scene = new THREE.Scene();
    var renderer;
    if (Modernizr.webgl) {
      renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    } else {
      renderer = new THREE.CanvasRenderer({alpha: true, antialias: true});
    }
    renderer.setSize(w, h);
    var camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 10000);
    camera.position.z = 250;
    iElem.append(renderer.domElement);

    var container = new THREE.Object3D();
    scene.add(container);
    // var geometry = new THREE.SphereGeometry(100, 16, 16);
    // var material = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true, side: THREE.DoubleSide } );
    // var sphere = new THREE.Mesh( geometry, material );
    // container.add( sphere );

    var geometry, material, scale, i;
    material = new THREE.SpriteMaterial( { map: THREE.ImageUtils.loadTexture( "images/circle.png" ) } );
    geometry = new THREE.CircleGeometry(5, 16);

    var lat, lng;
    var topics = [];
    for (i = 0; i < 25; i ++) {
      //material = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.DoubleSide });
      //var circle = new THREE.Mesh(geometry, material);
      var circle = new THREE.Sprite(material.clone());
      // lat = Math.round((Math.random() * 180 - 90) / 5 / 5) * 5;
      // lat += (Math.random() * 4) - 2;
      // lng = Math.round((((Math.random() * 360 - 180) / 6) - 90) / 5) * 5;
      // lng += (Math.random() * 4) - 2;
      // var point = new latLongTo3d(lat, lng, 100);
      var point = new latLongTo3d((Math.random() * 180 - 90) / 3, Math.random() * 360 - 180, 100);
      circle.position.x = point.x;
      circle.position.y = point.y;
      circle.position.z = point.z;
      scale = (Math.random() * 2) + 3;
      circle.scale.set(scale, scale, 0);
      container.add(circle);
      topics.push(circle);
      circle.isInteractive = true;
    }

    var tags = [];
    for (i = 0; i < 80; i ++) {
      var circle = new THREE.Sprite(material);
      var point = new latLongTo3d(Math.random() * 180 - 90, Math.random() * 360 - 180, 100);
      circle.position.x = point.x;
      circle.position.y = point.y;
      circle.position.z = point.z;
      scale = 1;
      circle.scale.set(scale, scale, 0);
      container.add(circle);
      tags.push(circle);
    }

    material = material.clone();
    for (i = 0; i < 300; i ++) {
      geometry = new THREE.CircleGeometry(5, 16);
      material.opacity = 0.2;
      var circle = new THREE.Sprite(material);
      var point = new latLongTo3d(Math.random() * 180 - 90, Math.random() * 360 - 180, 100);
      circle.position.x = point.x;
      circle.position.y = point.y;
      circle.position.z = point.z;
      scale = 0.5;
      circle.scale.set(scale, scale, 0);
      container.add(circle);
    }

    material = new THREE.LineBasicMaterial({
      color: 0x000000, opacity: 0.1, transparent: true, fog: true
    });

    geometry = new THREE.Geometry();
    var line, origin, dest;
    for (i = 0; i < topics.length; i ++) {
      origin = topics[i];
      for(var j = 0; j < 5; j ++) {
        dest = tags[Math.floor(Math.random() * tags.length)];
        geometry = new THREE.Geometry();
        geometry.vertices.push(
          new THREE.Vector3( origin.position.x, origin.position.y, origin.position.z ),
          new THREE.Vector3( dest.position.x, dest.position.y, dest.position.z )
        );
        line = new THREE.Line( geometry, material, THREE.LinePieces );
        container.add( line );
      }
    }

    function latLongTo3d(lat, long, radius) {
      // https://en.wikipedia.org/wiki/Spherical_coordinate_system
      var phi = (lat + 90) * Math.PI / 180; // to radians
      var theta = (long + 180) * Math.PI / 180; // to radians
      var sinPhi = Math.sin(phi);

      var point = new THREE.Vector3();
      point.x = radius * Math.cos(theta) * sinPhi;
      point.z = radius * Math.sin(theta) * sinPhi;
      point.y = radius * Math.cos(phi);

      return point;
    }

    function uvToLatLong(u, v) {
      var lat = v * 180 - 90;
      var long = u * 360 - 180;
      return [long, lat];
    }

    function render() {
      stats.begin();
      container.rotation.y += 0.0006;
      // animateTopics();
      // checkMouseOver();
      renderer.render(scene, camera);
      requestAnimationFrame(render);
      stats.end();
    }
    render();

    function checkMouseOver() {
      var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
      projector.unprojectVector( vector, camera );
      raycaster.set( camera.position, vector.sub( camera.position ).normalize() );
      var intersects = raycaster.intersectObjects( container.children );
      if ( intersects.length > 0) {
        for (var i = 0; i < intersects.length; i ++) {
          if (intersected != intersects[i].object && intersects[i].object.isInteractive) {
            if ( intersected ) intersected.material.opacity = 1;
            intersected = intersects[i].object;
            intersected.material.opacity = 0.5;
          }
        }
      } else {
        if ( intersected ) intersected.material.opacity = 1;
        intersected = null;
      }
    }

    function animateTopics() {
      var circle;
      for (var i = 0; i < topics.length; i ++) {
        circle = topics[i];

      }
    };

    function onDocumentMouseMove(event) {
      event.preventDefault();

      mouse.x = ( (event.clientX + $(window).scrollLeft() - $('#explore').position().left) / window.innerWidth ) * 2 - 1;
      mouse.y = - ( (event.clientY + $(window).scrollTop() - $('#explore').position().top) / window.innerHeight ) * 2 + 1;
    }
  };

  return ExploreCanvasDirective;
});

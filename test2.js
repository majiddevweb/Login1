//===================================================== full screen
var requestFullscreen = function(ele) {
  if (ele.requestFullscreen) {
    ele.requestFullscreen();
  } else if (ele.webkitRequestFullscreen) {
    ele.webkitRequestFullscreen();
  } else if (ele.mozRequestFullScreen) {
    ele.mozRequestFullScreen();
  } else if (ele.msRequestFullscreen) {
    ele.msRequestFullscreen();
  } else {
    console.log("Fullscreen API is not supported.");
  }
};
//===================================================== helpers
var randnum = (min, max) => Math.round(Math.random() * (max - min) + min);
//===================================================== add canvas
let renderer = new THREE.WebGLRenderer({alpha: true}); //transparent background
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xd8e7ff, 0);
document.body.appendChild(renderer.domElement);
//===================================================== resize
window.addEventListener("resize", function() {
  let width = window.innerWidth;
  let height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
//===================================================== add Scene
let scene = new THREE.Scene();
//===================================================== add Camera
let camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
let cameraTarget = new THREE.Vector3(0, 0, 0);
//===================================================== add Grid
var plane = new THREE.GridHelper(50, 50);
plane.material.color = new THREE.Color("#696969");
scene.add(plane);
//===================================================== add Fog
//scene.fog = new THREE.Fog(0xd0e0f0, 2, 100);
//===================================================== add Axis
var axisHelper = new THREE.AxisHelper(1);
//scene.add( axisHelper );
//===================================================== add Light
var light = new THREE.DirectionalLight(0xefefff, 1.5);
light.position.set(1, 1, 1).normalize();
scene.add(light);
var light = new THREE.DirectionalLight(0xffefef, 1.5);
light.position.set(-1, -1, -1).normalize();
scene.add(light);
//===================================================== add Curve
var curve = new THREE.QuadraticBezierCurve3(
  new THREE.Vector3(0, 0, -10),
  new THREE.Vector3(-10, 7, 0),
  new THREE.Vector3(0, 0, 10)
);
var g = new THREE.Geometry();
g.vertices = curve.getPoints(50);
var m = new THREE.LineBasicMaterial({ color: new THREE.Color("skyblue") });
var curveObject = new THREE.Line(g, m);
//scene.add(curveObject);

var spline = curve;
//===================================================== add Model
//3d model from https://www.yobi3d.com
var obj;
var collidableMeshList = [];
loader =  new THREE.LegacyJSONLoader();
loader.load(
  "https://raw.githubusercontent.com/baronwatts/models/master/needle-leaf-tree.js",
  function(geometry, materials) {
    new Array(500).fill(null).map((d, i) => {
      obj = new THREE.Mesh(
        geometry,
        new THREE.MeshLambertMaterial({ vertexColors: THREE.FaceColors })
      );
      obj.scale.set(.5,.5,.5);
      obj.receiveShadow = true;
      obj.castShadow = true;
      obj.position.x = randnum(-20, 20);
      obj.position.y = 0;
      obj.position.z = randnum(-20, 20);

      collidableMeshList.push(obj);
      //collidableMeshList.map((d, i) => d.rotateY(Math.PI / Math.random() * i));
      collidableMeshList.map(
        (d, i) =>
          i % 2 == 0 ? d.rotateY(Math.PI / Math.random() * i) : d.rotateY(0)
      );

      scene.add(obj);
    });
  }
);
//===================================================== add Controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;
controls.maxPolarAngle = Math.PI / 2.1; //How far you can orbit vertically. You wont see below the below the line of the horizon
//controls.enabled = false;
//===================================================== add VR Mode
renderer.setPixelRatio(window.devicePixelRatio);
effect = new THREE.StereoEffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);

var VR = false;
function toggleVR() {
  if (VR) {
    VR = false;
    controls = new THREE.OrbitControls(camera, renderer.domElement);
  } else {
    VR = true;
    controls = new THREE.DeviceOrientationControls(camera);
    requestFullscreen(document.documentElement);
  }
  renderer.setSize(window.innerWidth, window.innerHeight);
}
//===================================================== Animate
var camPosIndex = 0;
var clock = new THREE.Clock();

function animate() {
  camPosIndex++;
  if (camPosIndex > 800) {
    camPosIndex = 0;
  }
  var camPos = spline.getPoint(camPosIndex / 800); //move camera x,y,z
  //var camRot = spline.getTangent(camPosIndex / 100);//roates camera x,y,z

  //move camera on path
  /*    camera.position.x = camPos.x;
    camera.position.y = camPos.y;
    camera.position.z = camPos.z;
    //keeps eye on the path
    camera.lookAt(spline.getPoint((camPosIndex+1) / 500));
    //camera.lookAt(new THREE.Vector3(0,0,10));
*/
  var delta = clock.getDelta();
  var elapsedTime = clock.getElapsedTime();
  var move = Math.cos(elapsedTime) * 0.0015;
  var move2 = Math.sin(elapsedTime) * 0.0025;

  collidableMeshList.map(
    (d, i) =>
      i % 3 == 0
        ? collidableMeshList[i].rotateX(move)
        : collidableMeshList[i].rotateY(move2)
  );
  requestAnimationFrame(animate);

  //VR
  VR ? effect.render(scene, camera) : renderer.render(scene, camera);
  controls.update();
}

animate();
camera.position.y = 3.5;
camera.position.z = -12;



var Detector = {
    canvas: !! window.CanvasRenderingContext2D,
    webgl: ( function () {
      try {
        var canvas = document.createElement( 'canvas' ); return !! ( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) );
      } catch ( e ) {
        return false;
      }
  
    } )(),
    workers: !! window.Worker,
    fileapi: window.File && window.FileReader && window.FileList && window.Blob,
    getWebGLErrorMessage: function () {
      var element = document.createElement( 'div' );
      element.id = 'webgl-error-message';
      element.style.fontFamily = 'monospace';
      element.style.fontSize = '13px';
      element.style.fontWeight = 'normal';
      element.style.textAlign = 'center';
      element.style.background = '#fff';
      element.style.color = '#000';
      element.style.padding = '1.5em';
      element.style.width = '400px';
      element.style.margin = '5em auto 0';
      if ( ! this.webgl ) {
        element.innerHTML = window.WebGLRenderingContext ? [
          'Your graphics card does not seem to support WebGL.<br />',
          'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
        ].join( '\n' ) : [
          'Your browser does not seem to support WebGL.<br/>',
          'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
        ].join( '\n' );
      }
      return element;
    },
  
    addGetWebGLMessage: function ( parameters ) {
  
      var parent, id, element;
      parameters = parameters || {};
      parent = parameters.parent !== undefined ? parameters.parent : document.body;
      id = parameters.id !== undefined ? parameters.id : 'oldie';
      element = Detector.getWebGLErrorMessage();
      element.id = id;
      parent.appendChild( element );
    }
  };
  
  // browserify support
  if ( typeof module === 'object' ) {
    module.exports = Detector;
  }
  
  if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
      var renderer, scene, camera, stats;
      var sphere, vertices1;
      var WIDTH = window.innerWidth;
      var HEIGHT = window.innerHeight;
      init();
      animate();
  
      function init() {
        camera = new THREE.PerspectiveCamera( 40, WIDTH / HEIGHT, 1, 10000 );
        camera.position.z = 350;
        scene = new THREE.Scene();
        var radius = 100, segments = 68, rings = 38;
        var geometry1 = new THREE.SphereGeometry( radius, segments, rings );
        var geometry2 = new THREE.BoxGeometry( 0.8 * radius, 0.8 * radius, 0.8 * radius, 10, 10, 10 );
        vertices1 = geometry1.vertices.length;
        var vertices = geometry1.vertices.concat( geometry2.vertices );
        var positions = new Float32Array( vertices.length * 3 );
        var colors = new Float32Array( vertices.length * 3 );
        var sizes = new Float32Array( vertices.length );
        var vertex;
        var color = new THREE.Color();
        for ( var i = 0, l = vertices.length; i < l; i ++ ) {
          vertex = vertices[ i ];
          vertex.toArray( positions, i * 3 );
          if ( i < vertices1 ) {
            color.setHSL( 0.1 + 0.1 * ( i / vertices1 ), 0.99, ( vertex.y + radius ) / ( 4 * radius ) );
          } else {
            color.setHSL( 0.6, 0.75, 0.25 + vertex.y / ( 2 * radius ) );
          }
          color.toArray( colors, i * 3 );
          sizes[ i ] = i < vertices1 ? 10 : 40;
        }
  
        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
        geometry.addAttribute( 'ca', new THREE.BufferAttribute( colors, 3 ) );
  
  THREE.ImageUtils.crossOrigin = '';
        var texture = THREE.ImageUtils.loadTexture("https://s3-us-west-2.amazonaws.com/s.cdpn.io/151574/quad_damage_3.png");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        var material = new THREE.ShaderMaterial( {
          uniforms: {
            amplitude: { type: "f", value: 1.0 },
            color:     { type: "c", value: new THREE.Color( 0xffffff ) },
            texture:   { type: "t", value: texture }
          },
          vertexShader:   document.getElementById( 'vertexshader' ).textContent,
          fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
          transparent:    true
        });
  
        sphere = new THREE.Points( geometry, material );
        scene.add( sphere );
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( WIDTH, HEIGHT );
        var container = document.getElementById( 'container' );
        container.appendChild( renderer.domElement );
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        container.appendChild( stats.domElement );
        window.addEventListener( 'resize', onWindowResize, false );
      }
  
      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
      }
  
      function sortPoints() {
        var vector = new THREE.Vector3();
        // Model View Projection matrix
        var matrix = new THREE.Matrix4();
        matrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
        matrix.multiply( sphere.matrixWorld );
        var geometry = sphere.geometry;
        var index = geometry.getIndex();
        var positions = geometry.getAttribute( 'position' ).array;
        var length = positions.length / 3;
        if ( index === null ) {
          var array = new Uint16Array( length );
          for ( var i = 0; i < length; i ++ ) {
            array[ i ] = i;
          }
          index = new THREE.BufferAttribute( array, 1 );
          geometry.setIndex( index );
        }
        var sortArray = [];
        for ( var i = 0; i < length; i ++ ) {
          vector.fromArray( positions, i * 3 );
          vector.applyProjection( matrix );
          sortArray.push( [ vector.z, i ] );
        }
        function numericalSort( a, b ) {
  
          return b[ 0 ] - a[ 0 ];
        }
        sortArray.sort( numericalSort );
        var indices = index.array;
        for ( var i = 0; i < length; i ++ ) {
  
          indices[ i ] = sortArray[ i ][ 1 ];
        }
        geometry.index.needsUpdate = true;
      }
  
      function animate() {
        requestAnimationFrame( animate );
        render();
        stats.update();
      }
  
      function render() {
        var time = Date.now() * 0.005;
        sphere.rotation.y = 0.02 * time;
        sphere.rotation.z = 0.02 * time;
        var geometry = sphere.geometry;
        var attributes = geometry.attributes;
        for ( var i = 0; i < attributes.size.array.length; i ++ ) {
          if ( i < vertices1 ) {
  
            attributes.size.array[ i ] = 16 + 12 * Math.sin( 0.1 * i + time );
          }
        }
        attributes.size.needsUpdate = true;
        sortPoints();
        renderer.render( scene, camera );
      }
  
      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
      var renderer = new THREE.WebGLRenderer();
      renderer.setSize( window.innerWidth, window.innerHeight );
      document.body.appendChild( renderer.domElement );
      
      var geometry = new THREE.SphereGeometry( 5, 0, 0 );
      var material = new THREE.MeshNormalMaterial ( {wireframe: true} );
      var sphere = new THREE.Mesh( geometry, material );
      scene.add( sphere );
       
      function render() {
          requestAnimationFrame( render );
          sphere.rotation.x += .01;
          sphere.rotation.y += .01;
          renderer.render( scene, camera );
      }
      render();
      
      window.addEventListener('resize', function() {
          var WIDTH = window.innerWidth,
          HEIGHT = window.innerHeight;
          renderer.setSize(WIDTH, HEIGHT);
          camera.aspect = WIDTH / HEIGHT;
          camera.updateProjectionMatrix();
      });
      
      /* Job Draw Variables and Functions */

var charCount = 5;
var nodeCount = 0;
var updatedCount = 0;
var speed = 1;
var stopwatchStarted = 0;

function createNode(job, parentTree) {
	var tree = document.createElement("div");
	tree.className="treeBox";
	
	job.tree = tree;
	parentTree.appendChild(tree);
	
	var node = document.createElement("div");
	node.className="node hidden";
	node.innerHTML = job.name.substring(0, charCount).split("").join("<br/>");
	
	job.node = node;
	tree.appendChild(node);
	
	nodeCount++;
}

function createEdge(parent, child) {
	
	// the two points to create the line
	var x1 = parent.node.offsetLeft + parent.node.offsetWidth / 2 - 1;
	var y1 = parent.node.offsetTop + parent.node.offsetHeight * 0.95;
	var x2 = child.node.offsetLeft + child.node.offsetWidth / 2 - 1;
	var y2 = child.node.offsetTop + child.node.offsetHeight * 0.05;
	
	// the length of the line
	var length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

	// place the line right between the two nodes
	// it will then be rotated into position
	var left = x1 - (x1 - x2) / 2;
	var top = y1 - (length - (y2 - y1)) / 2;

	// how much to rotate the line in radians from
	// its initial vertical position
	var rotation = Math.atan2(x1 - x2, y2 - y1);

	var rotate = "-moz-transform: rotate(" + rotation + "rad); -webkit-transform: rotate(" + rotation + "rad);";

	var edge = document.createElement("div");
	edge.className = "edge hidden";
	edge.style.height = length + "px";
	edge.style.top = top + "px";
	edge.style.left = left + "px";
	edge.style.mozTransform = "rotate(" + rotation + "rad)";
	edge.style.webkitTransform = "rotate(" + rotation + "rad)";
	
	child.edge = edge;
	
	document.getElementById("tree").appendChild(edge);
}

function layoutNodes(job, parentTree) {
	createNode(job, parentTree);

	if(job.jobResults !== undefined) {
		for(i in job.jobResults) {
			job.jobResults[i].parent = job;
			layoutNodes(job.jobResults[i], job.tree);
		}
	}
}

function layoutEdges(job) {
	if(job.parent !== undefined) {
		createEdge(job.parent, job);
	}

	if(job.jobResults !== undefined) {
		for(i in job.jobResults) {
			layoutEdges(job.jobResults[i]);
		}
	}
}

function updateClass(node, styleClass) {
	node.className = styleClass;
	updatedCount++;
}

function delayUpdate(node, nodeClass, delay) {
	var updateClassFunction = function() { updateClass(node, nodeClass); };
	setTimeout(updateClassFunction, delay / speed);
}

function setUpdates(job, start) {
	delayUpdate(job.node, "node active", (job.start - start));
	delayUpdate(job.node, "node done", (job.start + (isNaN(job.duration) ? 0 : job.duration) - start));
	delayUpdate(job.edge, "edge active", (job.start - start));
	delayUpdate(job.edge, "edge done", (job.start + (isNaN(job.duration) ? 0 : job.duration) - start));

	if(job.jobResults !== undefined) {
		for(i in job.jobResults) {
			setUpdates(job.jobResults[i], start);
		}
	}
}

function startStopwatch() {
	stopwatchStarted = new Date().getTime();
	drawStopwatch();
}

function drawStopwatch() {
	// we need to stop the stopwatch once all nodes have been drawn
	// for each job result, there will be two nodes drawn, hence when
	// we've drawn tracks*2 nodes, we stop the stopwatch
	if(updatedCount >= (nodeCount * 2)) {
		return;
	}

	var duration = (new Date().getTime() - stopwatchStarted) * speed;

	document.getElementById("stopwatch").innerHTML = (duration / 1000).toFixed(3) + "s";
	setTimeout(drawStopwatch, 10);
}

function draw(job, speedParam) {
	// set the speed factor
	speed = speedParam;
	
	// layout all the nodes first
	layoutNodes(job, document.getElementById("tree"));

	// after all the nodes are laid out and positioned
	// draw the edges connecting the nodes
	layoutEdges(job)

	// start the stop watch
	startStopwatch();

	// start coloring the tree
	setUpdates(job, job.start);
}




	var jobResult = {
  "jobId" : "falkor.0",
  "name" : "falkor",
  "path" : "/falkor",
  "start" : 1377281294612,
  "duration" : 0,
  "jobResults" : [ {
    "jobId" : "falkor.0.hello.0",
    "name" : "hello",
    "path" : "/falkor/hello",
    "start" : 1377281294651,
    "duration" : 1009,
    "jobResults" : [ {
      "jobId" : "falkor.0.hello.0.world.0",
      "name" : "world",
      "path" : "/falkor/hello/world",
      "start" : 1377281295675,
      "duration" : 2001,
      "jobResults" : [ {
        "jobId" : "falkor.0.hello.0.world.0.exclamation.0",
        "name" : "exclamation",
        "path" : "/falkor/hello/world/exclamation",
        "start" : 1377281297702,
        "duration" : 0
      }, {
        "jobId" : "falkor.0.hello.0.world.0.exclamation.1",
        "name" : "exclamation",
        "path" : "/falkor/hello/world/exclamation",
        "start" : 1377281297704,
        "duration" : 1
      } ]
    }, {
      "jobId" : "falkor.0.hello.0.world.1",
      "name" : "world",
      "path" : "/falkor/hello/world",
      "start" : 1377281295675,
      "duration" : 2000,
      "jobResults" : [ {
        "jobId" : "falkor.0.hello.0.world.1.exclamation.0",
        "name" : "exclamation",
        "path" : "/falkor/hello/world/exclamation",
        "start" : 1377281297699,
        "duration" : 0
      }, {
        "jobId" : "falkor.0.hello.0.world.1.exclamation.1",
        "name" : "exclamation",
        "path" : "/falkor/hello/world/exclamation",
        "start" : 1377281297701,
        "duration" : 0
      } ]
    }, {
      "jobId" : "falkor.0.hello.0.world.2",
      "name" : "world",
      "path" : "/falkor/hello/world",
      "start" : 1377281295675,
      "duration" : 2004,
      "jobResults" : [ {
        "jobId" : "falkor.0.hello.0.world.2.exclamation.0",
        "name" : "exclamation",
        "path" : "/falkor/hello/world/exclamation",
        "start" : 1377281297711,
        "duration" : 19
      }, {
        "jobId" : "falkor.0.hello.0.world.2.exclamation.1",
        "name" : "exclamation",
        "path" : "/falkor/hello/world/exclamation",
        "start" : 1377281297712,
        "duration" : 17
      } ]
    } ]
  }, {
    "jobId" : "falkor.0.hello.1",
    "name" : "hello",
    "path" : "/falkor/hello",
    "start" : 1377281294651,
    "duration" : 1009,
    "jobResults" : [ {
      "jobId" : "falkor.0.hello.1.world.0",
      "name" : "world",
      "path" : "/falkor/hello/world",
      "start" : 1377281295674,
      "duration" : 2001,
      "jobResults" : [ {
        "jobId" : "falkor.0.hello.1.world.0.exclamation.0",
        "name" : "exclamation",
        "path" : "/falkor/hello/world/exclamation",
        "start" : 1377281297692,
        "duration" : 1
      }, {
        "jobId" : "falkor.0.hello.1.world.0.exclamation.1",
        "name" : "exclamation",
        "path" : "/falkor/hello/world/exclamation",
        "start" : 1377281297695,
        "duration" : 3,
      "jobResults" : [ {
        "jobId" : "falkor.0.hello.1.world.0.exclamation.0",
        "name" : "exclamation",
        "path" : "/falkor/hello/world/exclamation",
        "start" : 1377281297692,
        "duration" : 1
      }, {
        "jobId" : "falkor.0.hello.1.world.0.exclamation.1",
        "name" : "exclamation",
        "path" : "/falkor/hello/world/exclamation",
        "start" : 1377281297695,
        "duration" : 3
      } ]
      }, {
        "jobId" : "falkor.0.hello.1.world.0.exclamation.1",
        "name" : "exclamation",
        "path" : "/falkor/hello/world/exclamation",
        "start" : 1377281297695,
        "duration" : 3
      }, {
        "jobId" : "falkor.0.hello.1.world.0.exclamation.1",
        "name" : "exclamation",
        "path" : "/falkor/hello/world/exclamation",
        "start" : 1377281297695,
        "duration" : 3
      } ]
    }, {
      "jobId" : "falkor.0.hello.1.world.1",
      "name" : "world",
      "path" : "/falkor/hello/world",
      "start" : 1377281295674,
      "duration" : 2003,
      "jobResults" : [ {
        "jobId" : "falkor.0.hello.1.world.1.exclamation.0",
        "name" : "exclamation",
        "path" : "/falkor/hello/world/exclamation",
        "start" : 1377281297708,
        "duration" : 1
      }, {
        "jobId" : "falkor.0.hello.1.world.1.exclamation.1",
        "name" : "exclamation",
        "path" : "/falkor/hello/world/exclamation",
        "start" : 1377281297711,
        "duration" : 20
      } ]
    }, {
      "jobId" : "falkor.0.hello.1.world.2",
      "name" : "world",
      "path" : "/falkor/hello/world",
      "start" : 1377281295674,
      "duration" : 2001,
      "jobResults" : [ {
        "jobId" : "falkor.0.hello.1.world.2.exclamation.0",
        "name" : "exclamation",
        "path" : "/falkor/hello/world/exclamation",
        "start" : 1377281297695,
        "duration" : 2
      }, {
        "jobId" : "falkor.0.hello.1.world.2.exclamation.1",
        "name" : "exclamation",
        "path" : "/falkor/hello/world/exclamation",
        "start" : 1377281297697,
        "duration" : 0
      } ]
    } ]
  }, {
    "jobId" : "falkor.0.hello.2",
    "name" : "hello",
    "path" : "/falkor/hello",
    "start" : 1377281294651,
    "duration" : 1009,
    "jobResults" : [ ]
  }, {
    "jobId" : "falkor.0.hello.3",
    "name" : "hello",
    "path" : "/falkor/hello",
    "start" : 1377281294651,
    "duration" : 1009,
    "jobResults" : [ {
      "jobId" : "falkor.0.hello.3.world.0",
      "name" : "world",
      "path" : "/falkor/hello/world",
      "start" : 1377281295679,
      "duration" : 2001,
      "jobResults" : [ {
        "jobId" : "falkor.0.hello.3.world.0.exclamation.0",
        "name" : "exclamation",
        "path" : "/falkor/hello/world/exclamation",
        "start" : 1377281297712,
        "duration" : 19
      }, {
        "jobId" : "falkor.0.hello.3.world.0.exclamation.1",
        "name" : "exclamation",
        "path" : "/falkor/hello/world/exclamation",
        "start" : 1377281297713,
        "duration" : 14
      } ]
    }, {
      "jobId" : "falkor.0.hello.3.world.1",
      "name" : "world",
      "path" : "/falkor/hello/world",
      "start" : 1377281295680,
      "duration" : 2000,
      "jobResults" : [ {
        "jobId" : "falkor.0.hello.3.world.1.exclamation.0",
        "name" : "exclamation",
        "path" : "/falkor/hello/world/exclamation",
        "start" : 1377281297726,
        "duration" : 1
      }, {
        "jobId" : "falkor.0.hello.3.world.1.exclamation.1",
        "name" : "exclamation",
        "path" : "/falkor/hello/world/exclamation",
        "start" : 1377281297743,
        "duration" : 3
      } ]
    }, {
      "jobId" : "falkor.0.hello.3.world.2",
      "name" : "world",
      "path" : "/falkor/hello/world",
      "start" : 1377281295680,
      "duration" : 2000,
      "jobResults" : [ ]
    } ]
  } ]
};


document.querySelector("button").addEventListener("click", (e)=>{
    
    console.log("TROCAR")
   
    var el = document.querySelector("#drill");
    var el2 = document.querySelector("#thumbDown");
    var el4 = document.querySelector("#drill2");
    var v3 = document.querySelector("#thumbUp");
   
    if ((document.querySelector("#drill").object3D.visible == true))  {
        
        el.object3D.visible = false;
        el2.object3D.visible = false;
        v3.object3D.visible = true;
        el4.object3D.visible = true;
    }
   
    else {
    el.object3D.visible = true;
    el2.object3D.visible = true;
    v3.object3D.visible = false;
    el4.object3D.visible = false;  
    }
  })
 
document.querySelector("button2").addEventListener("click", (e)=>{
    console.log("+")
    
    //seleção dos objetos pegando a id de cada um  
    var el = document.querySelector("#bancada");
    var el2 = document.querySelector("#drill");
    var el3 = document.querySelector("#thumbDown");
    var el4 = document.querySelector("#thumbUp");
    var el5 = document.querySelector("#drill2");  
  
  //------------------------------------------------------    
  // Animação da furadeira 
  
  //(SEM stopdrill)
  el2.setAttribute('animation', 'property: position; dur: 3000; from: 0, -1, -1.5; to: 2.4, -2.5, 0; loop: true;' );  
  //(COM stopdrill)
  el5.setAttribute('animation', 'property: position; dur: 3000; from: 0, -1, -1.5; to: 1.4, -1.8, 0; loop: true;' );     
  //--------------------------------------------------   
      
  // modificação de posição para todos os objetos    
  el.object3D.position.set(-0.5, -1, -1); // bancada
  el2.object3D.position.set(0 -1, -1); // DRIL 
  el3.object3D.position.set(-0.5, -1, -1); // thumbDown
  el4.object3D.position.set(-0.5, -1, -1); // thumbUp
  el5.object3D.position.set(0, -1, -1); // DRILL 2 (com stopdrill)    
  //-------------------------------------------
  //modição do tamanho para todos os objetos 
   el.object3D.scale.set(5, 5, 5);
   el2.object3D.scale.set(5, 5, 5);
   el3.object3D.scale.set(5, 5, 5);
   el4.object3D.scale.set(5, 5, 5);  
   el5.object3D.scale.set(5, 5, 5);    
   //------------------------------------------- 
  
  // modificação da rotação de todos os objetos     
  el.object3D.rotation.set(
    THREE.Math.degToRad(-45), //x
    THREE.Math.degToRad(0),   //y
    THREE.Math.degToRad(0)    //z
  );
  el2.object3D.rotation.set( // DRIL 
    THREE.Math.degToRad(-45),
    THREE.Math.degToRad(20),
    THREE.Math.degToRad(0)
  );
  el3.object3D.rotation.set(  //thumb down 
    THREE.Math.degToRad(-45),
    THREE.Math.degToRad(0),
    THREE.Math.degToRad(0)
  );
  el4.object3D.rotation.set(  //thumb up 
    THREE.Math.degToRad(-45),
    THREE.Math.degToRad(0),
    THREE.Math.degToRad(0)
  );     
  el5.object3D.rotation.set( // DRILL + stopdrill
    THREE.Math.degToRad(-45),
    THREE.Math.degToRad(20),
    THREE.Math.degToRad(0)
  );
      
  })
  //===============================================
  // BOTAO -
    document.querySelector("button3").addEventListener("click", (e)=>{
    
    console.log("-")
    
    //seleção dos objetos pegando pela id    
    var el = document.querySelector("#bancada");
    var el2 = document.querySelector("#drill");
    var el3 = document.querySelector("#thumbDown");
    var el4 = document.querySelector("#thumbUp");
    var el5 = document.querySelector("#drill2");  
  
  //----------------------------------------------------------    
      //Animação das furadeiras 
      //(sem o drill)
      el2.setAttribute('animation', 'property: position; dur: 3000; from: 0 0 1; to: 0 0 1; loop: true');
      //(com o drill)
      el5.setAttribute('animation', 'property: position; dur: 3000; from: 0 0 1; to: 0 0 1; loop: true'); 
  //-----------------------------------------------------------
  // resetando as posições    
  el.object3D.position.set(0, 0, 1);
  el2.object3D.position.set(0, 0, 1);
  el3.object3D.position.set(0, 0, 1);
  el4.object3D.position.set(0, 0, 1); 
  el5.object3D.position.set(0, 0, 1);    
  
   //resetando tamanho
   el.object3D.scale.set(2, 2, 2);
   el2.object3D.scale.set(2, 2, 2);
   el3.object3D.scale.set(2, 2, 2);
   el4.object3D.scale.set(2, 2, 2); 
   el5.object3D.scale.set(2, 2, 2); 
  
  //-------------------------    
  // resetando rotações    
  el.object3D.rotation.set(
    THREE.Math.degToRad(0),
    THREE.Math.degToRad(0),
    THREE.Math.degToRad(0)
  );
  el2.object3D.rotation.set(
    THREE.Math.degToRad(0),
    THREE.Math.degToRad(0),
    THREE.Math.degToRad(0)
  );
  el3.object3D.rotation.set(
    THREE.Math.degToRad(0),
    THREE.Math.degToRad(0),
    THREE.Math.degToRad(0)
  );
  el4.object3D.rotation.set(
    THREE.Math.degToRad(0),
    THREE.Math.degToRad(0),
    THREE.Math.degToRad(0)
  );  
  el5.object3D.rotation.set(
    THREE.Math.degToRad(0),
    THREE.Math.degToRad(0),
    THREE.Math.degToRad(0)
  );            
  //------------------------- 
  })
  
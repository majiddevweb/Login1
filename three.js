var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

var alpha = true

var renderer = new THREE.WebGLRenderer({ alpha: alpha })
renderer.setSize(window.innerWidth, window.innerHeight)
document.getElementById('root').appendChild(renderer.domElement)

///////////
// Cubes //
///////////

// Cube1
var geometry = new THREE.BoxGeometry(.5,.5,.5)
var material = new THREE.MeshBasicMaterial({ color: 0x060606})
var cube = new THREE.Mesh(geometry, material)
scene.add(cube)

// Cube1Outline
var geometryOutline = new THREE.BoxGeometry(1,1,1)
var materialOutline = new THREE.MeshBasicMaterial({ color: 0xFF003F, wireframe: true })
var cubeOutline = new THREE.Mesh(geometryOutline, materialOutline)
cubeOutline.material.opacity = .5
scene.add(cubeOutline)

// Cube2
var size = 1.4
var geometry2 = new THREE.BoxGeometry(size, size, size)
var material2 = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: true })
var cube2 = new THREE.Mesh(geometry2, material2)
cube2.material.opacity = .125
scene.add(cube2)

// Cube3
var size2 = size * 1.5
var geo3 = new THREE.BoxGeometry(size2, size2, size2)
var mat3 = new THREE.MeshBasicMaterial({ color: 0xFF003F , wireframe: true})
var cube3 = new THREE.Mesh(geo3, mat3)
cube3.material.opacity = .125
scene.add(cube3)

camera.position.z = 5

// Cube4
var size3 = 2.6
var geometry3 = new THREE.BoxGeometry(size3, size3, size3)
var material3 = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: true })
var cube4 = new THREE.Mesh(geometry3, material3)
cube2.material.opacity = .125
scene.add(cube4)

// Glitchy
var composer = new POSTPROCESSING.EffectComposer(renderer)

// Effects
var chromaticAberrationEffect = new POSTPROCESSING.ChromaticAberrationEffect()
var glitchEffect = new POSTPROCESSING.GlitchEffect({
})
var noiseEffect = new POSTPROCESSING.NoiseEffect({
	blendFunction: POSTPROCESSING.BlendFunction.COLOR_DODGE
})

noiseEffect.blendMode.opacity.value = 0.15;

var glitchPass = new POSTPROCESSING.EffectPass(camera, glitchEffect)
var chromaticAberrationPass = new POSTPROCESSING.EffectPass(camera, chromaticAberrationEffect)

chromaticAberrationPass.renderToScreen = true
glitchPass.renderToScreen = true


// composer.addPass(chromaticAberrationPass)
var effectPass = new POSTPROCESSING.EffectPass(camera, glitchEffect, noiseEffect)



composer.addPass(new POSTPROCESSING.RenderPass(scene, camera))
// composer.addPass(effectPass)

composer.addPass(glitchPass)



const clock = new THREE.Clock()
animate = null

(function animate(clock) {
	requestAnimationFrame(animate)
	
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
	cubeOutline.rotation.x += 0.01;
  cubeOutline.rotation.y += 0.01;
	cube2.rotation.x += 0.015;
	cube2.rotation.y += 0.015;
	
	cube4.rotation.x += 0.015;
	cube4.rotation.y += 0.015;
	
	cube3.rotation.x += 0.01;
	cube3.rotation.y += 0.01;
	
	// renderer.render(scene, camera)
	composer.render(clock)	
}())
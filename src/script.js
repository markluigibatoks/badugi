import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import gsap from 'gsap'

import {createCardObject, createCardOutline} from './helpers'

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects

// TODO: Add a User beside the Cards
const mainUserCards = [8,9,10,11,12] //[8,9,10,11,12]
const objectsToDetect = []

const cardsToAnimate = []

for(let n in mainUserCards) {
    const Xgap = 0.15
    const Zgap = 0.001

    let cardObject = createCardObject(mainUserCards[n])
    objectsToDetect.push(cardObject)

    let cardOutline = createCardOutline()

    let cardGroup = new THREE.Group()

    cardGroup.position.x = Xgap * n
    cardGroup.position.y = 4
    cardGroup.position.z = Zgap * n

    cardGroup.rotation.z = -4
    cardGroup.rotation.y = -3.21

    cardGroup.add(cardObject)
    cardGroup.add(cardOutline)


    cardsToAnimate.push(cardGroup)

    scene.add(cardGroup)
}

for(let n of cardsToAnimate) {
    gsap.to(n.rotation, {
        z: 0,
        duration: 0.8
    })
    gsap.to(n.position, {
        y: 0,
        duration: 0.8
    })
    gsap.to(n.rotation, {
        y: 0,
        duration: 0.3,
        delay: 0.8
    })
}



const geometry1 = new THREE.CircleGeometry( 0.24, 32 );
const material1 = new THREE.MeshStandardMaterial( { color: 0xaaaaaa, side: THREE.DoubleSide } );
const circle = new THREE.Mesh( geometry1, material1 );
circle.position.x = -0.7
circle.position.z = 0.001
scene.add( circle );

const geometry2 = new THREE.CircleGeometry( 0.28, 32 );
const material2 = new THREE.MeshStandardMaterial( { color: 0x0000ff, side: THREE.DoubleSide } );
const circle1 = new THREE.Mesh( geometry2, material2 );
circle1.position.x = -0.7
scene.add( circle1 );

const shape = new THREE.Shape();

shape.moveTo(-0.1, 0.1);
shape.lineTo(0.08, 0.07);
shape.lineTo(0.1, -0.1);

// Lights

const pointLight = new THREE.PointLight(0xffffff, 1.4)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Mouse
const pointer = new THREE.Vector2();

function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
}

window.addEventListener( 'pointermove', onPointerMove )


const raycaster = new THREE.Raycaster();

function onMouseDown(){
    raycaster.setFromCamera( pointer, camera );
    const intersects = raycaster.intersectObjects( objectsToDetect, true );


    // Toggle Selected state of Card
    if(intersects.length){

        // if the card is in active state/ is selected state 
        // then animate card to the original Y position
        if(intersects[0].object.parent.parent.position.y ){

            gsap.to(intersects[0].object.parent.parent.position, {
                y: 0,
                duration: 0.5,
            })

            gsap.to(intersects[0].object.parent.parent.children[1], {
                visible: false,
                duration: 0.5,
            })
        }else {

            gsap.to(intersects[0].object.parent.parent.position, {
                y: 0.3,
                duration: 0.5,
            })

            gsap.to(intersects[0].object.parent.parent.children[1], {
                visible: true,
                duration: 0.5,
            })
        }
    }
}


window.addEventListener('mousedown', onMouseDown )

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 4

console.log(sizes.width / sizes.height)

const helper = new THREE.CameraHelper( camera );
scene.add( helper );

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    powerPreference: "high-performance",
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2) )

/**
 * Animate
 */

const clock = new THREE.Clock()



const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    // Update objects
    // objectsToDetect[0].rotation.y = .5 * elapsedTime

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

// TODO: Animate Cards inig hatag sa Dealer sa cards
// Rotate Z
// Move ang position Y from dealer
// Rotate Y para mag flip

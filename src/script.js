import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import gsap from 'gsap'
import playerJson from './player.json'
import { Player } from './player'

import { distributeCard } from './helpers'

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const playerPosition = [
    {
        x: 0,
        y: 0
    },
    {
        x: -3,
        y: 1
    },
    {
        x: 3,
        y: 1
    },
    {
        x: -3,
        y: 2
    },
    {
        x: 3,
        y: 2
    },
]

// Objects
const cardsPerPlayer = 4;
const players = []
const objectsToDetect = []
const cardsToAnimate = []

// Init Player Class
Object.values(playerJson).map(x => {
    players.push(new Player(x.image, x.cards))
})

objectsToDetect.push(...players[0].cardObjects)

for(let i = 0; i < cardsPerPlayer; i ++) {
    for(let j = 0; j < players.length; j ++){
        cardsToAnimate.push(players[j].cardGroup[i])
    }
}

/**
 * Init table
 */
players.forEach( (x, index) => {

    const player = new THREE.Group()
    
    player.add(x.image)

    x.cardGroup.forEach(y => {
        scene.add(y)
    })
    
    scene.add(player)
    player.position.x = playerPosition[index].x
    player.position.y = playerPosition[index].y
})


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

        // toggle Y axis of card group
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

const light = new THREE.AmbientLight( 0xffffff, 1 );
scene.add( light );

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 4

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

let count = 0;

const tick = () =>
{
    if(count < cardsToAnimate.length){
        distributeCard(cardsToAnimate[count], count, playerPosition.length, playerPosition[count % playerPosition.length].x + (count/playerPosition.length * 0.20), playerPosition[count % playerPosition.length].y)
    }

    count ++

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

// TODO: ALIGN CARD POSITION
import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import gsap from 'gsap'
import playerJson from './player.json'
import Player from './player'

import { distributeCard } from './helpers'

// loading manager
const progressBox = document.getElementsByClassName('progress')[0]
const progressElement = document.getElementById('progress')
const loadingManager = new THREE.LoadingManager()

loadingManager.onStart = () => {
    progressElement.value = 0
}

loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    let loaded = Math.round(itemsLoaded/itemsTotal) * 100
    progressElement.value = loaded
}

loadingManager.onLoad = function ( ) {
	progressBox.style.display = 'none'
};

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const sceneMap = new THREE.TextureLoader(loadingManager).load('poker-table2.png')
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x005B13)

const gameSettings = {
    playerPosition: [{
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
    }]
}

// Objects
const cardsPerPlayer = 4;
const players = []
const objectsToDetect = []
const cardsOnHand = []

const enemyDeck = [
    {
        "suit": "joker",
        "value": "joker"
    },
    {
        "suit": "joker",
        "value": "joker"
    },
    {
        "suit": "joker",
        "value": "joker"
    },
    {
        "suit": "joker",
        "value": "joker"
    },
    {
        "suit": "joker",
        "value": "joker"
    },
]

// Init Player Class
Object.values(playerJson).map(x => {

    let deck = []
    if(!x.deck){
        // Probably an enemy :D
        deck.push(...enemyDeck)
    }else {
        deck.push(...x.deck)
    }

    players.push(new Player(x.image, deck))
})

// Add Card Content to ObjectsToDetect for Raycasting
players[0].deck.cards.forEach(x => objectsToDetect.push(x.item))

// For Dealer animation
for(let i = 0; i < cardsPerPlayer; i ++) {
    for(let j = 0; j < players.length; j ++){
        cardsOnHand.push(players[j].deck.cards[i].mesh)
    }
}

/**
 * Init table
 */
players.forEach( (x, index) => {

    const player = new THREE.Group()
    
    player.add(x.image)

    x.deck.cards.forEach(y => {
        scene.add(y.mesh)
    })
    
    scene.add(player)
    player.position.x = gameSettings.playerPosition[index].x
    player.position.y = gameSettings.playerPosition[index].y
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
        // show outline of card
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
    if(count < cardsOnHand.length){
        distributeCard(cardsOnHand[count], count, gameSettings.playerPosition.length, gameSettings.playerPosition[count % gameSettings.playerPosition.length].x + (count/gameSettings.playerPosition.length * 0.20), gameSettings.playerPosition[count % gameSettings.playerPosition.length].y)
    }

    count ++

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

// TODO: ALIGN CARD POSITION
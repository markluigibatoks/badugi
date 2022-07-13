import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import playerJson from './player.json'
import gameSettings from './gameSettings.json'
import Player from './player'

import { dealerCardAnimation, toggleCard, initTextures, getCardIndexFromDeck, initGUI } from './helpers'

const textures = initTextures()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const sceneMap = textures.sceneMap
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x005B13)


// Objects
const players = []
const objectsToDetect = []

// Init Player Class
Object.values(playerJson).map(x => {

    let deck = []
    if(!x.deck){
        // Probably an enemy :D
        deck.push(...gameSettings.enemyDeck)
    }else {
        deck.push(...x.deck)
    }

    players.push(new Player(x.image, deck, textures))
})

// Add Card Content to ObjectsToDetect for Raycasting
players[0].deck.cards.forEach(x => objectsToDetect.push(x.item))

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
        let cardIndex = getCardIndexFromDeck(intersects[0].object.parent.parent.id, players[0].deck.cards)
        toggleCard(players[0].deck.cards[cardIndex], gameSettings.cardPosition[0][cardIndex].y)
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
camera.position.x = gameSettings.cameraPosition.x
camera.position.y = gameSettings.cameraPosition.y
camera.position.z = gameSettings.cameraPosition.z

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
let index = 0;

let length = players.length

let isSorted = false
let sortCount = 0

const tick = () =>
{
    if(count < players.length * gameSettings.cardsPerPlayer){

        let card = players[count % players.length].deck.cards[index].mesh
        let x = gameSettings.cardPosition[count % players.length][index].x
        let y = gameSettings.cardPosition[count % players.length][index].y

        dealerCardAnimation(card, count, length, x, y)
    
        count ++
        if(count % length === 0) {
            index ++
        }
    } else if (!isSorted) {
        players[0].deck.sort()
        initGUI(players, camera)
        isSorted = true
    } else if(sortCount < players[0].deck.cards.length) {

        setTimeout(() => {
            if(sortCount < 4) {
                let card = players[0].deck.cards[sortCount].mesh
                let x = gameSettings.cardPosition[0][sortCount].x
                let y = gameSettings.cardPosition[0][sortCount].y

                dealerCardAnimation(card, sortCount, length, x, y)
            }

            sortCount ++
        }, 2000)
        
    }
        
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


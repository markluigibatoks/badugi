import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import gsap from 'gsap'
import playerJson from './player.json'
import gameSettings from './gameSettings.json'
import Player from './player'

import { dealerCardAnimation } from './helpers'

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
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

// Debug
const gui = new dat.GUI()

const playerCardFolder = gui.addFolder('Player Card Position')

players.forEach( (player, index) => {
    const playerFolder = playerCardFolder.addFolder(`Player ${index + 1}`)
    player.deck.cards.forEach((card, index) => {
        const cardFolder = playerFolder.addFolder(`Card ${index + 1}`)
        cardFolder.add(card.mesh.position, 'x').min(-4).max(4).step(0.001)
        cardFolder.add(card.mesh.position, 'y').min(-4).max(4).step(0.001)
    })
})

const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'x', 0, 4, 0.001)
cameraFolder.add(camera.position, 'y', 0, 4, 0.001)
cameraFolder.add(camera.position, 'z', 0, 4, 0.001)


function initTextures () {
    const textures = {}
    const progressBox = document.getElementsByClassName('progress')[0]
    const progressElement = document.getElementById('progress')
    const loadingManager = new THREE.LoadingManager()
    const textureLoader = new THREE.TextureLoader(loadingManager)

    loadingManager.onStart = () => {
        progressElement.value = 0
    }

    loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
        let loaded = Math.round(itemsLoaded/itemsTotal) * 100
        progressElement.value = loaded
    }

    loadingManager.onLoad = function ( ) {
        progressBox.style.display = 'none'
    }


    textures.sceneMap = textureLoader.load('poker-table2.png')

    const getKey = (key, obj) => obj[key]

    for(let i = 0; i < 4; i ++) {
        for (let j = 1; j <= 13; j ++) {

            let s = getKey(gameSettings.suits[i], {
                heart: 'h',
                diamond: 'd',
                clove: 'c',
                spade: 's'
            })
            textures[`${s}${j}`] = textureLoader.load(`cards/${s}${j}.png`)
        }
    }

    textures.cardFold = textureLoader.load('cards/cards-back.png')
    textures.joker = textureLoader.load('cards/joker.png')

    return textures
}

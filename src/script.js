import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import playerJson from './player.json'
import gameSettings from './gameSettings.json'
import Player from './player'
import animate from './animate.js'

import { dealerCardAnimation, toggleCard, initTextures, initGUI, getCardIndexFromDeck, getNumberOfSelectedCards, checkIfCardIsSelected, foldCards } from './helpers'

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

const clock = new THREE.Clock()

window.addEventListener('resize', () =>
{
    
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.fov = 65;
    camera.position.z = 3
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    animate({
        renderer: renderer,
        camera: camera,
        scene: scene,
        animationTime: clock.getDelta(),
        loop: 1
    })
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

    if(intersects.length){

        const id = intersects[0].object.parent.parent.id
        const index = getCardIndexFromDeck(id, players[0].deck.cards)

        if(!checkIfCardIsSelected(players[0].deck.cards[index]) && getNumberOfSelectedCards(players[0].deck.cards) >= 2){
            console.log('Maximum of possible draw card is 2')
            return
        }

        const itemsToAnimate = []
        itemsToAnimate.push({
            card: players[0].deck.cards[index],
            y: players[0].deck.cards[index].mesh.position.y === gameSettings.selectedPositionY ? gameSettings.cardPosition[0][index].y : gameSettings.selectedPositionY,
            isOutline: players[0].deck.cards[index].mesh.position.y !== gameSettings.selectedPositionY
        })

        animate({
            renderer: renderer,
            scene: scene,
            camera: camera,
            loop: 1,
            animationTime: 0.6 * 1000,
            itemsToAnimate: itemsToAnimate,
            foo: (count, itemsToAnimate) => {
                toggleCard(count, itemsToAnimate[count])
            }
        })
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

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

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

const totalCards = players.length * gameSettings.cardsPerPlayer;

(async () => {
    const itemsToDistribute = []

    for(let i = 0, index = 0; i < totalCards;) {

        const card = players[i % players.length].deck.cards[index].mesh
        const x = gameSettings.cardPosition[i % players.length][index].x
        const y = gameSettings.cardPosition[i % players.length][index].y

        itemsToDistribute.push({card: card, x: x, y: y})

        i ++
        if(i % players.length === 0) {
            index ++
        }
    }

    await animate ({
        renderer: renderer,
        scene: scene,
        camera: camera,
        animationTime: (Math.log10(totalCards) + (totalCards * 0.05) + 0.4) * 1000,
        loop: totalCards,
        itemsToAnimate: itemsToDistribute,
        foo: (count, itemsToAnimate) => {
            dealerCardAnimation(count, itemsToAnimate[count])
        }
    })

    players[0].deck.sort()

    const itemsToSort = []

    for(let i = 0; i < gameSettings.cardsPerPlayer; i ++) {
        const card = players[0].deck.cards[i].mesh
        const x = gameSettings.cardPosition[0][i].x
        const y = gameSettings.cardPosition[0][i].y

        itemsToSort.push({card: card, x: x, y: y})
    }

    await animate ({
        renderer: renderer,
        scene: scene,
        camera: camera,
        animationTime: (Math.log10(gameSettings.cardsPerPlayer) + (gameSettings.cardsPerPlayer * 0.05) + 0.4) * 1000,
        loop: gameSettings.cardsPerPlayer,
        itemsToAnimate: itemsToSort,
        foo: (count, itemsToAnimate) => {
            dealerCardAnimation(count, itemsToAnimate[count])
        }
    })

    const itemsToFold = []
    for(let i = 0; i < gameSettings.cardsPerPlayer; i ++) {
        const card = players[1].deck.cards[i].mesh
        const x = gameSettings.foldPosition[1][i].x

        itemsToFold.push({ card: card, x: x })
    }

    await animate ({
        renderer: renderer,
        scene: scene,
        camera: camera,
        animationTime: (Math.log10(gameSettings.cardsPerPlayer) + (gameSettings.cardsPerPlayer * 0.01)) * 1000,
        loop: gameSettings.cardsPerPlayer,
        itemsToAnimate: itemsToFold,
        foo: (count, itemsToAnimate) => {
            foldCards(count, itemsToAnimate[count])
        }
    })
})()
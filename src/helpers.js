import * as THREE from 'three'
import gsap from 'gsap'
import gameSettings from './gameSettings.json'
import * as dat from 'dat.gui'

/**
 * 
 * @param {The tile you want to display} currentTile 
 * @param {The total number of Columns in a Row} tilesX 
 * @param {The total number of Rows} tilesY 
 * @param {The path to sprite e.g 'cards-sprite.gif'} staticSrc 
 * @returns a Texture
 */

  // Return a Texture from the given Sprite
function getTextureFromSprite (tile, tilesX, tilesY, staticSrc) {
  const map = new THREE.TextureLoader().load(staticSrc)
  map.magFilter = THREE.NearestFilter
  map.repeat.set(1/tilesX, 1/tilesY)

  const offsetX = (tile % tilesX) / tilesX
  const offsetY = (tilesY - Math.floor(tile / tilesX) - 1) / tilesY

  map.offset.x = offsetX
  map.offset.y = offsetY

  return map
}

function dealerCardAnimation (count, itemToAnimate) {
  gsap.to(itemToAnimate.card.rotation, {
    z: 0,
    duration: 0.4,
    delay: (count * 0.05)
  })
  gsap.to(itemToAnimate.card.position, {
      x: itemToAnimate.x,
      duration: 0.4,
      delay: (count * 0.05)
  })
  gsap.to(itemToAnimate.card.position, {
      y: itemToAnimate.y,
      duration: 0.4,
      delay: (count * 0.05)
  })
  gsap.to(itemToAnimate.card.position, {
      z: 0.0021 * count,
      duration: 0.1,
      delay: (count * 0.05)
  })
  if(count % gameSettings.playersCount == 0){
    gsap.to(itemToAnimate.card.rotation, {
        y: 0,
        duration: 0.1,
        delay: 0.4 + (count * 0.1)
    })
  }
}

function toggleCard (count, itemToAnimate) {
  gsap.to(itemToAnimate.card.mesh.position, {
      y: itemToAnimate.y,
      duration: 0.5,
  })

  gsap.to(itemToAnimate.card.outline, {
      visible: itemToAnimate.isOutline,
      duration: 0.5,
  })
}

function getNumberOfSelectedCards(cards) {
  let count = 0;
  cards.forEach(x => {
    if(x.outline.visible) {
      count ++;
    }
  })

  return count
}

function checkIfCardIsSelected(card) {
  return card.outline.visible
}

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
          textures[`${s}${j}`] = textureLoader.load(`cards/original/${s}${j}.png`)
      }
  }

  textures.cardFold = textureLoader.load('cards/cards-back.png')
  textures.joker = textureLoader.load('cards/joker.png')

  return textures
}

function getCardIndexFromDeck (id, cards) {
  let index = 0

  for(let i = 0; i < cards.length; i ++) {
      if(id === cards[i].mesh.id) {
          index = i
          break;
      }
  }

  return index
}

function initGUI (players, camera) {
  const gui = new dat.GUI()

  const playerCardFolder = gui.addFolder('Player Card Position')

  players.forEach( (player, index) => {
      const playerFolder = playerCardFolder.addFolder(`Player ${index + 1}`)
      player.deck.cards.forEach((card, index) => {
          const cardFolder = playerFolder.addFolder(`Card ${index + 1}`)
          cardFolder.add(card.mesh.position, 'x').min(-4).max(4).step(0.001)
          cardFolder.add(card.mesh.position, 'y').min(-4).max(4).step(0.001)
          cardFolder.add(card.mesh.position, 'z').min(-4).max(4).step(0.001)
      })
  })

  const cameraFolder = gui.addFolder('Camera')
  cameraFolder.add(camera.position, 'x', 0, 4, 0.0001)
  cameraFolder.add(camera.position, 'y', 0, 4, 0.0001)
  cameraFolder.add(camera.position, 'z', 0, 4, 0.0001)
}

export {getTextureFromSprite, dealerCardAnimation, toggleCard, initTextures, getCardIndexFromDeck, initGUI, getNumberOfSelectedCards, checkIfCardIsSelected }
import * as THREE from 'three'
import gsap from 'gsap'
import gameSettings from './gameSettings.json'

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

function dealerCardAnimation (card, count = 0, length = 5, x, y) {
  gsap.to(card.rotation, {
    z: 0,
    duration: 0.4,
    delay: (count * 0.05)
  })
  gsap.to(card.position, {
      x: x,
      duration: 0.4,
      delay: (count * 0.05)
  })
  gsap.to(card.position, {
      y: y,
      duration: 0.4,
      delay: (count * 0.05)
  })
  gsap.to(card.position, {
      z: 0.001 * count,
      duration: 0.1,
      delay: (count * 0.05)
  })
  if(count % length == 0){
      gsap.to(card.rotation, {
          y: 0,
          duration: 0.1,
          delay: 0.4 + (count * 0.1)
      })
  }
}

function toggleCard (card, y) {
  if(card.mesh.position.y === gameSettings.selectedPositionY) {
    gsap.to(card.mesh.position, {
        y: y,
        duration: 0.5,
    })

    gsap.to(card.outline, {
        visible: false,
        duration: 0.5,
    })
  } else {
    gsap.to(card.mesh.position, {
      y: gameSettings.selectedPositionY,
      duration: 0.5,
    })

    gsap.to(card.outline, {
        visible: true,
        duration: 0.5,
    })
  }
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

export {getTextureFromSprite, dealerCardAnimation, toggleCard, initTextures, getCardIndexFromDeck }
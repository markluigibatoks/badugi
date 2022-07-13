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
  gsap.to(card.mesh.position, {
      y: card.mesh.position.y === gameSettings.selectedPositionY ? y : gameSettings.selectedPositionY,
      duration: 0.5,
  })

  gsap.to(card.outline, {
      visible: !card.outline.visible,
      duration: 0.5,
  })
}

export {getTextureFromSprite, dealerCardAnimation, toggleCard }
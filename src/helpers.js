import * as THREE from 'three'
import gsap from 'gsap'

/**
 * 
 * @param {The tile you want to display} currentTile 
 * @param {The total number of Columns in a Row} tilesX 
 * @param {The total number of Rows} tilesY 
 * @param {The path to sprite e.g 'cards-sprite.gif'} staticSrc 
 * @returns a Texture
 */

  // Return a Texture from the given Sprite
function getTextureFromSprite (currentTile, tilesX, tilesY, staticSrc) {

  const map = new THREE.TextureLoader().load(staticSrc)
  map.magFilter = THREE.NearestFilter
  map.repeat.set(1/tilesX, 1/tilesY)

  const offsetX = (currentTile % tilesX) / tilesX
  const offsetY = (tilesY - Math.floor(currentTile / tilesX) - 1) / tilesY

  map.offset.x = offsetX
  map.offset.y = offsetY

  return map
}

function createCardObject (currentTile){
  // Objects
  const geometryFront = new THREE.PlaneGeometry( 0.5, 0.7, 1, 1 )
  const geometryBack = new THREE.PlaneGeometry( 0.5, 0.7, 1, 1 )

  // // Materials
  const textureFront = getTextureFromSprite(currentTile, 13, 5, 'cards-sprite.gif')
  const textureBack = getTextureFromSprite(52, 13, 5, 'cards-sprite.gif')

  const materialFront = new THREE.MeshBasicMaterial({map: textureFront, color: 0xffffff, side: THREE.FrontSide})
  const materialBack = new THREE.MeshBasicMaterial({map: textureBack, color: 0xffffff, side: THREE.BackSide})

  const card = new THREE.Group()

  // Mesh
  const mesh1 = new THREE.Mesh( geometryFront, materialFront )
  card.add( mesh1 )
  const mesh2 = new THREE.Mesh( geometryBack, materialBack )
  card.add( mesh2 )

  return card
}

function createCardOutline (){
  let geometryOutline = new THREE.PlaneGeometry( 0.55, 0.75, 1, 1 )
  let materialOutline = new THREE.MeshBasicMaterial({color: 0x049ef4, side: THREE.DoubleSide})
  let mesh = new THREE.Mesh( geometryOutline, materialOutline )
  mesh.position.z = -0.0001
  mesh.visible = false

  return mesh
}

function distributeCards (cardsToAnimate){
  const time = Math.round(Date.now() / 1000)

  setInterval (() => {
      let currentTime = Math.round(Date.now() / 1000) - time
  
      if(currentTime <= cardsToAnimate.length) {
  
          gsap.to(cardsToAnimate[currentTime - 1].rotation, {
              z: 0,
              duration: 0.4
          })
          gsap.to(cardsToAnimate[currentTime - 1].position, {
              y: 0,
              duration: 0.4
          })
          gsap.to(cardsToAnimate[currentTime - 1].position, {
              z: 0.009 * currentTime,
              duration: 0.1,
          })
          gsap.to(cardsToAnimate[currentTime - 1].rotation, {
              y: 0,
              duration: 0.1,
              delay: 1
          })
      } else {
          clearInterval()
      }
  }, 1000)
}

export { createCardOutline, getTextureFromSprite, createCardObject, distributeCards }
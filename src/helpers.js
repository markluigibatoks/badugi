import * as THREE from 'three'

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

  const materialFront = new THREE.MeshStandardMaterial({map: textureFront, color: 0xffffff, side: THREE.FrontSide})
  const materialBack = new THREE.MeshStandardMaterial({map: textureBack, color: 0xffffff, side: THREE.BackSide})

  const card = new THREE.Group()

  // Mesh
  const mesh1 = new THREE.Mesh( geometryFront, materialFront )
  card.add( mesh1 )
  const mesh2 = new THREE.Mesh( geometryBack, materialBack )
  card.add( mesh2 )

  return card
}

export { getTextureFromSprite, createCardObject }
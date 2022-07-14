import * as THREE from 'three'
import gameSettings from './gameSettings.json'

export default class Deck {
  constructor (cards, textures) {
    this.cards = loadCards(cards, textures)
  }

  sort () {
    const getKey = (key, obj) => obj[key]
    this.cards.sort((a, b) => getKey (a.value, gameSettings.values) - getKey (b.value, gameSettings.values) )
  }
}

class Card {
  constructor (suit = 'joker', value = 'joker', textures) {
    this.suit = suit
    this.value = value
    this.item = item(suit, value, textures)
    this.outline = outline()
    this.mesh = createCard(this.item, this.outline)
  }
}

function createCard (item, outline){
  const card = new THREE.Group()
  card.add(item)
  card.add(outline)
  card.name='card'
  return card
}

function item (suit, value, textures) {
  // Objects
  const geometryFront = new THREE.PlaneGeometry( 0.7, 0.9, 1, 1 )
  const geometryBack = new THREE.PlaneGeometry( 0.7, 0.9, 1, 1 )

  // // Materials
  const textureBack = textures.cardFold
  const textureFront = getTexture(suit, value, textures)

  const materialBack = new THREE.MeshStandardMaterial({map: textureBack, color: 0xffffff, side: THREE.BackSide})
  const materialFront = new THREE.MeshStandardMaterial({map: textureFront, color: 0xffffff, side: THREE.FrontSide})

  const card = new THREE.Group()

  // Mesh
  const mesh1 = new THREE.Mesh( geometryFront, materialFront )
  mesh1.name = `${value} of ${suit}s`
  card.add( mesh1 )
  const mesh2 = new THREE.Mesh( geometryBack, materialBack )
  mesh2.name = 'materialBack'
  card.add( mesh2 )
  card.name = 'content'
  return card
}

function outline () {
  let geometry = new THREE.PlaneGeometry( 0.73, 0.93, 1, 1 )
  let material = new THREE.MeshStandardMaterial({color: 0x049ef4, side: THREE.DoubleSide})
  let mesh = new THREE.Mesh( geometry, material )
  mesh.position.z = -0.0001
  mesh.visible = false
  
  mesh.name = "outline"

  return mesh
}

function loadCards (cards, textures) {
  return cards.map(x => new Card(x.suit, x.value, textures))
}

function getTexture (suit, value, textures) {
  if(suit === 'joker' || value === 'joker') {
    return textures.joker
  }

  const getKey = (key, obj) => obj[key]
  
  let s = getKey(suit, {
      heart: 'h',
      diamond: 'd',
      clove: 'c',
      spade: 's'
  })

  let v = getKey(value, {
    A: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    J: 11,
    Q: 12,
    K: 13,
  })

  return textures[`${s}${v}`]
}


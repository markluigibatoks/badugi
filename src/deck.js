import * as THREE from 'three'
import { getTextureFromSprite } from './helpers'

const SUITS = ['heart', 'diamond', 'clove', 'spade']
const VALUES = [
  'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'
]

export default class Deck {
  constructor (cards) {
    this.cards = loadCards(cards)
  }
}

class Card {
  constructor (suit = 'joker', value = 53) {
    this.suit = suit
    this.value = value
    this.item = item(this.suit, this.value)
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

function item (suit, value) {
  // Objects
  const geometryFront = new THREE.PlaneGeometry( 0.5, 0.7, 1, 1 )
  const geometryBack = new THREE.PlaneGeometry( 0.5, 0.7, 1, 1 )

  // // Materials
  const textureBack = getTextureFromSprite(52, 13, 5, 'cards-sprite.gif')
  const textureFront = getTextureFromSprite(location(suit, value), 13, 5, 'cards-sprite.gif')

  const materialBack = new THREE.MeshStandardMaterial({map: textureBack, color: 0xffffff, side: THREE.BackSide})
  const materialFront = new THREE.MeshStandardMaterial({map: textureFront, color: 0xffffff, side: THREE.FrontSide})

  const card = new THREE.Group()

  // Mesh
  const mesh1 = new THREE.Mesh( geometryFront, materialFront )
  mesh1.name = 'materialFront'
  card.add( mesh1 )
  const mesh2 = new THREE.Mesh( geometryBack, materialBack )
  mesh2.name = 'materialBack'
  card.add( mesh2 )
  card.name = 'content'
  return card
}

function outline () {
  let geometry = new THREE.PlaneGeometry( 0.55, 0.75, 1, 1 )
  let material = new THREE.MeshStandardMaterial({color: 0x049ef4, side: THREE.DoubleSide})
  let mesh = new THREE.Mesh( geometry, material )
  mesh.position.z = -0.0001
  mesh.visible = false
  
  mesh.name = "outline"

  return mesh
}

function loadCards (cards) {
  return cards.map(x => new Card(x.suit, x.value))
}

function location (suit, value) {
  const getKey = (key, obj) => obj[key]

  return getKey(suit, {
    heart: getKey(value, {
      A: 12,
      2: 0,
      3: 1,
      4: 2,
      5: 3,
      6: 4,
      7: 5,
      8: 6,
      9: 7,
      10: 8,
      J: 9,
      Q: 10,
      K: 11,
    }),
    diamond: getKey(value, {
      A: 25,
      2: 13,
      3: 14,
      4: 15,
      5: 16,
      6: 17,
      7: 18,
      8: 19,
      9: 20,
      10: 21,
      J: 22,
      Q: 23,
      K: 24
    }),
    clove: getKey(value, {
      A: 38,
      2: 26,
      3: 27,
      4: 28,
      5: 29,
      6: 30,
      7: 31,
      8: 32,
      9: 33,
      10: 34,
      J: 35,
      Q: 36,
      K: 37
    }),
    spade: getKey(value, {
      A: 51,
      2: 39,
      3: 40,
      4: 41,
      5: 42,
      6: 43,
      7: 44,
      8: 45,
      9: 46,
      10: 47,
      J: 48,
      Q: 49,
      K: 50
    }),
    joker: 52
  })
} 


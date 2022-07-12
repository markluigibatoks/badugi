import * as THREE from 'three'
import Deck from './deck'

export default class Player {
  constructor(image, deck) {

    this.image = createUserObject(image)

    this.deck = new Deck(deck)

    this.deck.cards = this.deck.cards.map((card) => {

      card.mesh.position.x = 0
      card.mesh.position.y = 4

      card.mesh.rotation.z = -4
      card.mesh.rotation.y = 3.21

      return card
    })
  }
}

function createUserObject (image = ''){
  const playerImage = new THREE.Group()

  
  const geometry = new THREE.CircleGeometry( 0.24, 32 );
  const material = new THREE.MeshStandardMaterial( {color: 0xaaaaaa, side: THREE.DoubleSide } );
  if(image !== '') {
    const imageTexture = new THREE.TextureLoader().load(image)
    material.map = imageTexture
  }

  const circle = new THREE.Mesh( geometry, material );
  circle.position.x = -0.7
  circle.position.z = 0.001
  playerImage.add( circle );


  const geometry2 = new THREE.CircleGeometry( 0.28, 32 );
  const material2 = new THREE.MeshStandardMaterial( { color: 0x049EF4, side: THREE.DoubleSide } );
  const circle2 = new THREE.Mesh( geometry2, material2 );
  circle2.position.x = -0.7
  playerImage.add( circle2 );

  return playerImage
}
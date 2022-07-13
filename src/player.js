import * as THREE from 'three'
import Deck from './deck'
import gameSettings from './gameSettings.json'

export default class Player {
  constructor(image, deck, textures) {

    this.image = createUserObject(image)

    this.deck = new Deck(deck, textures)

    this.deck.cards = this.deck.cards.map((card) => {

      card.mesh.position.x = gameSettings.dealer.position.x
      card.mesh.position.y = gameSettings.dealer.position.y

      card.mesh.rotation.y = gameSettings.dealer.rotation.y
      card.mesh.rotation.z = gameSettings.dealer.rotation.z

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
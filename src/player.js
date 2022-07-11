import * as THREE from 'three'
import { getTextureFromSprite } from './helpers'

export class Player {
  constructor(image, card) {
    this.image = this.createUserObject(image)

    this.cardObjects = card ? card.map(x => {
      return this.createCardObject(x)
    }) : this.enemy()

    this.cardGroup = this.cardObjects.map((card) => {
      let cardOutline = this.createCardOutline()

      let cardGroup = new THREE.Group()

      cardGroup.position.x = 0
      cardGroup.position.y = 4

      cardGroup.rotation.z = -4
      cardGroup.rotation.y = 3.21

      cardGroup.add(card)
      cardGroup.add(cardOutline)

      return cardGroup
    })
  }

  createCardObject (currentTile){
    // Objects
    const geometryFront = new THREE.PlaneGeometry( 0.5, 0.7, 1, 1 )
    const geometryBack = new THREE.PlaneGeometry( 0.5, 0.7, 1, 1 )
  
    // // Materials
    const textureBack = getTextureFromSprite(52, 13, 5, 'cards-sprite.gif')

    const materialFront = new THREE.MeshStandardMaterial({color: 0xffffff, side: THREE.FrontSide})
    const materialBack = new THREE.MeshStandardMaterial({map: textureBack, color: 0xffffff, side: THREE.BackSide})
    
    if(currentTile){
      const textureFront = getTextureFromSprite(currentTile, 13, 5, 'cards-sprite.gif')
      materialFront.map = textureFront
    }

    const card = new THREE.Group()
  
    // Mesh
    const mesh1 = new THREE.Mesh( geometryFront, materialFront )
    card.add( mesh1 )
    const mesh2 = new THREE.Mesh( geometryBack, materialBack )
    card.add( mesh2 )
  
    return card
  }
  
  createCardOutline (){
    let geometryOutline = new THREE.PlaneGeometry( 0.55, 0.75, 1, 1 )
    let materialOutline = new THREE.MeshStandardMaterial({color: 0x049ef4, side: THREE.DoubleSide})
    let mesh = new THREE.Mesh( geometryOutline, materialOutline )
    mesh.position.z = -0.0001
    mesh.visible = false
  
    return mesh
  }

  createUserObject (image = ''){
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

  enemy () {
    const cards = []

    for(let i = 0; i < 4; i ++){
      cards.push(this.createCardObject())
    }

    return cards
  }
}
const sleep = time => new Promise(res => setTimeout(res, time))

export default _properties => new Promise(resolve => {
  const foo = () => { 
    throw new Error('Object to animate is blank')
  }

  const properties = Object.assign({
    animationTime: 2800,
    foo: foo,
    count: 0,
    index: 0
  }, _properties)

  let start, previousTimeStamp
  let done = false
  let stopId

  const tick = async (timestamp) => {
    if(start === undefined) {
        start = timestamp
    }

    const elapseTime = timestamp - start
    if(previousTimeStamp !== timestamp) {
      properties.foo({count: properties.count, index: properties.index, length: properties.length, players: properties.players})
      
      properties.count ++
      
      if(properties.count % properties.length === 0) {
        properties.index ++
      }
    }
  
    if(elapseTime <  properties.animationTime){
        previousTimeStamp = timestamp

        if(!done) {
        // Render
            properties.renderer.render(properties.scene, properties.camera)

            stopId = window.requestAnimationFrame(tick)
        }

    } else {
      window.cancelAnimationFrame(stopId)
      resolve()
    } 
  }

  window.requestAnimationFrame(tick)
})

 
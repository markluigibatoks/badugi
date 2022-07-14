const sleep = time => new Promise(res => setTimeout(res, time))

export default _properties => new Promise(resolve => {
  const foo = () => { }

  const properties = Object.assign({
    animationTime: 2800,
    foo: foo,
    loop: 20
  }, _properties)

  let start, previousTimeStamp
  let stopId, count = 0

  const tick = async (timestamp) => {
    if(start === undefined) {
        start = timestamp
    }

    const elapseTime = timestamp - start
    if(previousTimeStamp !== timestamp) {
      if(count < properties.loop){
        properties.foo(count, properties.itemsToAnimate)
        count ++
      }
    }
  
    if(elapseTime < properties.animationTime){
        previousTimeStamp = timestamp

        // Render
        properties.renderer.render(properties.scene, properties.camera)

        stopId = window.requestAnimationFrame(tick)

    } else {
      window.cancelAnimationFrame(stopId)
      resolve()
    } 
  }

  window.requestAnimationFrame(tick)
})

 
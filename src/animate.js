export default _properties => {
  const foo = () => { throw new Error('Object to animate is blank')}

  const properties = Object.assign({
    animationTime: 2800,
    foo: foo
  }, _properties)

  let start, previousTimeStamp
  let done = false
  let stopId

  const tick = (timestamp) =>
  {
      if(start === undefined) {
          start = timestamp
      }
  
      const elapseTime = timestamp - start
      if(previousTimeStamp !== timestamp) {
        properties.foo(properties.count, properties.index, properties.length, properties.players)
        
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
          done = true
          window.cancelAnimationFrame(stopId)
          return done
     } 
 }

 window.requestAnimationFrame(tick)
}

 
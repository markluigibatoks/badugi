function Test(_properties)  {
  const properties = Object.assign({
    count: 0,
  }, _properties)

  return {
    get count () {
      return properties.count
    },

    increment () {
      properties.count++
    }
  }
}

const test = Test()
console.log(test.count);
test.increment()
console.log(test.count);
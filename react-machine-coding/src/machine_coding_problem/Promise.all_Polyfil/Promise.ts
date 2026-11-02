// const p1 = Promise.resolve(10)
// const p2 = Promise.resolve(20)
// const p3 = Promise.resolve(30)

// Promise.all([p1, p2, p3])
//   .then((result) => {
//     console.log(result) // [10, 20, 30]
//   })
//   .catch((error) => console.log('error>>>', error))

// // Check whether the input is an array
// if(!Array.isArray(promises)) {
//   reject(new TypeError("Input must be an Array"))
//   return
// }

// // Handle the empty array
// if(promises.length === 0){
//   resolve([])
//   return
// }

// // Loop over the inputs
// promises.forEach((item, index) => {
//   // Handle one item
// })

// // Handle promises, values, and thenables
// Promises.resolve()
//   .then(() => item)
//   .then((value) => {
//     results[index] = value as T;
//     completed++;
//     if(completed === promises.length){
//       resolve(results)
//     }   
//   }, reject)


function myPromiseAll<T>(promises: Array<T | PromiseLike<T>>): Promise<T[]> {
  return new Promise<T[]>((resolve, reject) => {
    // 1. validate input
    if(!Array.isArray(promises)){
      reject(new TypeError("Input must be an Array"))
      return
    }

    // 2. Prepare storage and counter
    const results: T[] = []    
    let completed = 0

    // 3. handle empty Array
    if(promises.length === 0){
      resolve([])
      return
    }

    // 4. Process every item
    promises.forEach((item, index) => {
      Promise.resolve()
        .then(() => item)
        .then(
          (value) => {
            // preserve original order
            results[index] = value as T

            // count successful results
            completed++

            // resolved only when all success
            if(completed === promises.length){
              resolve(results)
            }
          },
          (error) => {
            // reject as soon as item fails
            reject(error)
          }
        )
    })
  })
}

myPromiseAll<number | string | boolean>([ 42, Promise.resolve("hello"), Promise.resolve(true)]).then(console.log)
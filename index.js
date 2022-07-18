const app = require('./model/app')

app.listen(3000, () => {
    console.log('Server connected to port 3000')
})





// const {Lesson} = require('./model/models') 

// const task = async() => {
//     let x = await Lesson.findById('62d0ea8eb29c7ca8bba8d869')
//     let y = await x.populate('user_id')
//     try{
//         console.log(y)
//     }catch(e){
//         console.log(e.message)
//     }
// }
// task()
// const jwt = require("jsonwebtoken")

// const myJWT = async () => {
//     const token = jwt.sign({
//         _id: 'abcd123'
//     }, 'thisismysecure')
//     console.log(token)

//     const verify = jwt.verify(token, 'thisismysecure')
//     console.log(verify)
// }
// myJWT()
// function Animals(name, age) {
//     let newAnimal = Object.create(animalConstructor);
//     newAnimal.name = name;
//     newAnimal.age = age;
//     return newAnimal;
// }
// let animalConstructor = {
//     sing: function() {
//         return `${this.name} can sing`;
//     },
//     dance: function() {
//         return `${this.name} can dance`;
//     }
// }
// const clara = Animals('ew', 24);
// Object.setPrototypeOf(clara, animalConstructor);
// console.log(clara.sing());
// clara.whiskers();

require("./App2.js")
// const Calculatesum = require ("./Sum.js")
// const obj = require ("./Sum.js")      //without destructuring 
const{Calculatesum , IMP} = require ("./Calculate/Sum.js")  // another way by destructuring prop like we do in react .
const {CalculateMultiply} = require("./Calculate/Multiply.js")
console.log("hello world ");


// console.log(obj)


var a =  20
var b = -25
var z = a - b;
console.log(z)


function Calculate (x , y ,operation){
    if (operation === "addition"){
        return x + y;
    } else if(operation === "subtraction"){
        return x - y;
    }else if(operation === "multiplication"){
        return x * y;
    }else if (operation === "division"){
      return   y !== 0 ? x /y : "cannot divide by zero"
    }else{
        return "Invalid operation"
    }
}

const result = Calculate(20 , 40 , "subtraction")
console.log(result)

console.log(Calculate(40 , 20 , "division"))

// obj.Calculatesum(5,4);  // without destructuring 
// console.log(obj.IMP)


Calculatesum( 5,4); // by destructuring 
console.log(IMP)

CalculateMultiply(3,2)


// // console.log(global)  
// console.log(globalThis)


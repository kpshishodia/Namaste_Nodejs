console.log("hello world ");

var a =  20
var b = -25
var z = a - b;
console.log("z :",z)

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


// console.log(global)
console.log(globalThis)


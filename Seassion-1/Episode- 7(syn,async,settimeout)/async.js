const fs = require("fs");
const https = require("https");

console.log("Asynchronous Javascript");

var a = 5;
var b = 10;

// // ------------------------------
// Synchronous File Read (BLOCKING)
// ------------------------------
try {
    const syncData = fs.readFileSync("./file.txt", "utf8");
    console.log("Synchronous file data:", syncData);
} catch (err) {
    console.log("Error reading file synchronously:", err);
}

console.log("This will execute only after reading the file");


// ------------------------------
// Asynchronous HTTPS Call
// ------------------------------
https.get("https://dummyjson.com/products/1", (res) => {
    console.log("Data fetched successfully");
});


// ------------------------------
// Asynchronous Timer
// ------------------------------
setTimeout(() => {
    console.log("Execute it after 5 seconds");
}, 5000);


// ------------------------------
// Asynchronous File Read (NON-BLOCKING)
// ------------------------------
fs.readFile("./file.txt", "utf-8", (err, data) => {
    if (err) {
        console.log("Error reading file asynchronously:", err);
    } else {
        console.log("Asynchronous file data:", data);
    }
});


// ------------------------------
// Normal Synchronous Function
// ------------------------------
function multiply(x, y) {
    return x * y;
}

const c = multiply(a, b);
console.log("Multiplication ans is:", c);

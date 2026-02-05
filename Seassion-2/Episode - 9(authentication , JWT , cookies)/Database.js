// const {MongoClient} = require("mongodb")

// const url = "mongodb+srv://kpssecondid5_db_user:FbodvahjHt5MW05c@namastenode.2sgdd2e.mongodb.net/?appName=NamasteNode"

// const password = "FbodvahjHt5MW05c"


// const Client = new MongoClient(url)

// const dbName = "FirstDatabasetesting"

// async function main() {
//     await Client.connect();
//     console.log("Connected successfully to server.")
//     const db = Client.db(dbName);
//     const collection = db.collection("user")

//         return "done." ;
    
    
// }








// const { MongoClient } = require("mongodb");
// const { ObjectId } = require("mongodb");

// const url = "mongodb+srv://kpssecondid5_db_user:FbodvahjHt5MW05c@namastenode.2sgdd2e.mongodb.net/?appName=NamasteNode";
// const client = new MongoClient(url);

// const dbname = "FirstDatabasetesting"

// async function main() {
//     await client.connect();
//     console.log("Database connected successfully")
//     const db = client.db(dbname);
//     const collection = db.collection("user")

//     // ✅ Insert only ONCE — comment after first run
//     // const data = {
//     //     firstname: "Akshad",
//     //     lastname: "Jaiswal",
//     //     City: "Pune",
//     //     Gender: "Male"
//     // }
//     // await collection.insertOne(data);

//     // ✅ Read All
//     const findData = await collection.find({}).toArray();
//     console.log("All data :", findData)

//     // ✅ Count
//     const countData = await collection.countDocuments({});
//     console.log("Number of documents in db are :", countData)

//     // ✅ Filter Query
//     const filterResult = await collection.find({ firstname: "Karan" }).toArray();
//     console.log("Filter Result :", filterResult)

//     return "done"
// }

// main().then(console.log)
//     .catch(console.error)
//     .finally(() => client.close());







const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");


//connection URL
// const url = "mongodb+srv://kpssecondid5_db_user:FbodvahjHt5MW05c@namastenode.2sgdd2e.mongodb.net/?appName=NamasteNode"
// const url = "mongodb+srv://kpssecondid5_db_user:FbodvahjHt5MW05c@namastenode.2sgdd2e.mongodb.net/test"


// const dbname = "FirstDatabasetesting"
// const dbname = "users_validation"

const url = "mongodb+srv://kpssecondid5_db_user:FbodvahjHt5MW05c@namastenode.2sgdd2e.mongodb.net/test"
const client = new MongoClient(url);

// const dbname = "FirstDatabasetesting"
const dbname = "Auth_cookies_JWT_tokkens"


async function main() {
    await client.connect();
    console.log("Database connected successfully")
    const db = client.db(dbname);
    const collection = db.collection("user")

    // const data = {
    //     firstname: "Kumar", 
    //     lastname: "Sanu",
    //     City: "Mumbai",
    //     Gender : "Male",
    // }


    // Create
    // const insertData = await collection.insertMany([data])
    // console.log("data inserted = ", insertData)


    const insertData = await collection.insertOne(data)
    console.log("data inserted = ", insertData)


    // Update
    // const updateData = await collection.updateOne({ _id: new ObjectId('67066d6a3be8f41630d5dae4') }, { $set: { firstname: "Mint" } })
    // console.log("Updated document ", updateData)

    
    //Read 
    const findData = await collection.find({}).toArray();
    console.log("All data :", findData)

    //delete
    // const deletedata = await collection.deleteOne({ _id: new ObjectId('670668562c6bd11e25050c13') })
    // console.log("deleted data=>", deletedata)

    //Count documents
    const countData = await collection.countDocuments({})
    console.log("Number of documents in db are :", countData)

// filter

// const Filter = await collection.find({firstname : "Karan"}).toArray();
// console.log("Filter Result :" , Filter)

    return 'done'


}

main().then(console.log)
    .catch(console.error)
    .finally(() => client.close());



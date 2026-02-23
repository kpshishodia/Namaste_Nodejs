
const mongose = require("mongose")


const connectDb = async() => {
    await mongose.connect("mongodb+srv://kpssecondid5_db_user:FbodvahjHt5MW05c@namastenode.2sgdd2e.mongodb.net/?appName=NamasteNode")
}

connectDb().
then(() => {
    console.log("Connection to Database is Successful.")
}).catch((err) =>{
    console.error("Connection failed ." , err)
})
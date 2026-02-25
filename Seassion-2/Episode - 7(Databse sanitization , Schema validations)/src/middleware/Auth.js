const AdminAuth = (req,res,next) => {
    console.log("Admin Auth getting checked.")
    const token = "xyz"
    const isAdminAuthorized = token === "xyz"
    if(!isAdminAuthorized){
     res.status(401).send("Unauthorized request.")
    }else{
     next();
    }

}

const UserAuth = (req,res,next) => {
    console.log("User Auth getting checked.")
    const token = "xyz"
    const isUserAuthorized = token === "xyz"
    if(!isUserAuthorized){
     res.status(401).send("Unauthorized request.")
    }else{
     next();
    }

}

module.exports = {
AdminAuth,
UserAuth
}








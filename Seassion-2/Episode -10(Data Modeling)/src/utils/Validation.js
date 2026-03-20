const validator = require("validator");

const ValidateSignUpdata = (req) => {
    const { firstName, lastName, email, password } = req.body;

    // 1️⃣ Required fields
    if (!firstName || !lastName) {
        throw new Error("Firstname and lastname are required");
    }

    // 2️⃣ Length validation
    else if (firstName.length < 4 || firstName.length > 50) {
        throw new Error("Firstname must be 4-50 characters");
    }

    else if (lastName.length < 4 || lastName.length > 50) {
        throw new Error("Lastname must be 4-50 characters");
    }

    // 3️⃣ Email validation
    else if (!email) {
        throw new Error("Email is required");
    }

    else if (!validator.isEmail(email)) {
        throw new Error("Invalid email address");
    }

    // 4️⃣ Password validation (recommended)
    // if (!password || password.length < 6) {
    //     throw new Error("Password must be at least 6 characters");
    // }


    else if(!validator.isStrongPassword(password)){
        throw new Error("weak password , make it stronger.")
    }
};

// module.exports = {
//     ValidateSignUpdata,
// };

module.exports = ValidateSignUpdata;
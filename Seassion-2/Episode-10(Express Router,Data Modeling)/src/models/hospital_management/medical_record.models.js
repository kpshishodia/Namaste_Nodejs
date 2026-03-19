const mongoose = require("mongoose")

const {Schema} = mongoose

const medicalReportSchema = new Schema({

} ,{timestamps : true})

const MedicalReport = mongoose.model("MediaclReport" , medicalReportSchema , MedicalReport)

module.exports = MedicalReport
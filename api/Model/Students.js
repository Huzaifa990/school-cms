var mongoose = require("mongoose");

var studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    grade: {
        type: Number,
        required: true
    }
})

var Students = new mongoose.model("students", studentSchema);

module.exports = Students;
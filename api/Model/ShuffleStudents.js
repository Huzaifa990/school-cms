var mongoose  = require("mongoose");

var ShuffleStudentsSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true
    },
    periodNumber: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    teacherName: {
        type: String,
        required: true
    },
    attendanceStatus: {
        type: String,
        required: true
    },
    studentId: {
        type: String,
        required: true
    }
})

var ShuffleStudents = new mongoose.model("ShuffleStudents", ShuffleStudentsSchema);
module.exports = ShuffleStudents;
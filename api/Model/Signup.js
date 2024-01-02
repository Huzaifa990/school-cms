var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

var authSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  adminStatus: {
    type: String,
    default: "pending"
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
  },

  password: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    default: "incomplete",
  },

  floorName: {
    type: String,
  },

  roomNumber: {
    type: Number,
  },

  conferenceNumber: {
    type: Number,
  },

  conferencePeriods: [
    {
      type: Number,
    },
  ],
  periodInfo: [
    {
      periodNumber: {
        type: Number,
      },
      studentNames: [
        {
          type: String,
        },
      ],
      periodGrade: {
        type: Number,
      },
    },
  ],
  accountType: {
    type: String,
    required: true,
  },

  shuffleStudents: [
    {
      names: [
        {
          studentName: {
            type:String,
            required: true
          },
          attendance: {
            type: String,
            required: true
          }
        },
      ],
      periodNumber: {
        type: Number,
      },
    },
  ],

  absentStatus:{
    type: Boolean,
  },

});



authSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  next();
});

var Signup = new mongoose.model("Signup", authSchema);




module.exports = Signup;

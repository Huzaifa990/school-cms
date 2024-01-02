var mongoose = require("mongoose");

mongoose.connect("mongodb+srv://khaas25:1234@wlms.zjs0lk4.mongodb.net/school-cms").then(() => {
  console.log("Connected to database");

}).catch((e) => {
  console.log(e);
});

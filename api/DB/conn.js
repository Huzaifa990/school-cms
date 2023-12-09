var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/school-cms").then(() => {
  console.log("Connected to database");

}).catch((e) => {
  console.log(e);
});

var express = require("express");
var cors = require("cors");
require("./DB/conn");
var bcrypt = require("bcrypt");

var Signup = require("./Model/Signup");
var Students = require("./Model/Students");
const ShuffleStudents = require("./Model/ShuffleStudents");
var app = express();

app.use(express.json());
app.use(cors());
var port = 8080;

app.get("/", (req, res) => {
  res.send("========== WELCOME TO MY API ===========");
});

app.post("/signup", async (req, res) => {
  var addUser = new Signup(req.body);

  var findEmail = await Signup.findOne({ email: req.body.email });

  if (findEmail === null) {
    addUser
      .save()
      .then(() => {
        res.status(200).send(addUser);
      })
      .catch((e) => {
        res.status(404).send(e);
      });
  } else {
    res.status(404).send("Email already exsists");
  }
});

app.post("/signin", async (req, res) => {
  var findUser = await Signup.findOne({ email: req.body.email });
  if (findUser !== null) {
    var matchPassword = await bcrypt.compare(
      req.body.password,
      findUser.password
    );
    if (matchPassword) {
      res.status(200).send(findUser);
    } else {
      res.status(404).send("Incorrect Password!");
    }
  } else {
    res.status(404).send("User does not exist!");
  }
});

app.put("/teacherinfo/:id", async (req, res) => {
  try {
    var _id = req.params.id;

    var updateUser = await Signup.findByIdAndUpdate(_id, req.body, {
      new: true,
    });

    res.status(200).send(updateUser);
  } catch (e) {
    res.status(404).send(e);
  }
});

app.get("/allTeachers", async (req, res) => {
  var allTeachers = await Signup.find();
  res.status(200).send(allTeachers);
});

app.get("/teacher/:id", async (req, res) => {
  var _id = req.params.id;

  var findTeacher = await Signup.findById(_id);
  res.status(200).send(findTeacher);
});

//================== PERIOD INFO =================================

app.get("/periodInfo/:id/:periodNumber", async (req, res) => {
  var _id = req.params.id;
  var periodNumber = parseInt(req.params.periodNumber);

  try {
    var teacherInfo = await Signup.findById(_id);
    var chk = false;
    var index = 0;

    for (var i = 0; i < teacherInfo.periodInfo.length; i++) {
      if (periodNumber === teacherInfo.periodInfo[i].periodNumber) {
        chk = true;
        index = i;
      }
    }

    if (chk) {
      res.status(200).send(teacherInfo.periodInfo[index]);
    } else {
      res.status(404).send("Period Not Found!");
    }
  } catch (e) {
    res.status(404).send(e);
  }
});

//================== PERIOD INFO =================================

app.get("/confPeriods/:id", async (req, res) => {
  try {
    var _id = req.params.id;
    var teacherInfo = await Signup.findById(_id);
    res.status(200).send(teacherInfo.conferencePeriods);
  } catch (e) {
    res.status(404).send(e);
  }
});

app.put("/periodInfo/:id/:infoId", async (req, res) => {
  try {
    var teacherId = req.params.id;
    var objId = req.params.infoId;

    var updateInfo = await Signup.findOneAndUpdate(
      { _id: teacherId, "periodInfo._id": objId },
      {
        $set: {
          "periodInfo.$.periodNumber": req.body.periodNumber,
          "periodInfo.$.studentNames": req.body.studentNames,
          "periodInfo.$.periodGrade": req.body.periodGrade,
        },
      },
      { new: true }
    );

    res.status(200).send(updateInfo);
  } catch (e) {
    res.status(404).send(e);
  }
});

// ===================== STUDENTS ====================

app.post("/students", async (req, res) => {
  var addStudent = new Students(req.body);
  addStudent.save();
  res.status(200).send(addStudent);
});

// ===================== TEACHERS ====================

app.get("/teachers", async (req, res) => {
  var allTeachers = await Signup.find({
    status: "complete",
    accountType: "teacher",
  });
  res.status(200).send(allTeachers);
});

// ============== SHUFFLE =====================

app.post("/shuffle", async (req, res) => {
  try {
    const asyncForEach = async (array, callback) => {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    };

    const shuffleArray = (array) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    const shuffleStudents = async (absentTeacherId, availableTeacherIds) => {
      try {
        const absentTeacher = await Signup.findById(absentTeacherId);
        const periodInfo = absentTeacher.periodInfo;

        await asyncForEach(periodInfo, async (period, i) => {
          const studentNames = period.studentNames;
          const shuffleCount = Math.floor(
            studentNames.length / availableTeacherIds.length
          );
          let index = 0;
          const pNumber = period.periodNumber;

          await asyncForEach(studentNames, async (studentName, j) => {
            if (j % shuffleCount === 0) {
              const teacherId = availableTeacherIds[index];
              const teacherData = await Signup.findById(teacherId);

              const shuffledStudents = shuffleArray(
                studentNames.slice(j, j + shuffleCount)
              );
              var shuffleObjArray = [];

              for(let l = 0; l < shuffledStudents.length; l++){
                var studentObj = {
                  studentName: shuffledStudents[l],
                  attendance: "empty"
                }

                shuffleObjArray.push(studentObj);

              }
              const shuffleData = {
                names: shuffleObjArray,
                periodNumber: pNumber,
              };

              if (!teacherData.shuffleStudents) {
                teacherData.shuffleStudents = [];
              }

              teacherData.shuffleStudents.push(shuffleData);
              await teacherData.save();
              index = (index + 1) % availableTeacherIds.length;
            }
          });
        });

        return "Shuffle Successful!";
      } catch (error) {
        return "Shuffle Failed: " + error.message;
      }
    };

    // Usage
    const absentTeacherId = req.body.absentTeacherId;
    const availableTeachers = req.body.availableTeachers;

    shuffleStudents(absentTeacherId, availableTeachers)
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get("/shuffleStudents/:id", async (req, res)=>{
  try{
    var _id = req.params.id;

    var findTeacher = await Signup.findById(_id);

    var shuffleArray = findTeacher.shuffleStudents;

    shuffleArray.sort((a, b) => a.periodNumber - b.periodNumber);

    if(shuffleArray.length > 0){
      res.status(200).send(shuffleArray);
    }
    else{
      res.status(404).send("No Shuffle Students Available!");
    }
  }

  catch(e){
    res.status(404).send(e);
  }
})


app.get("/allShuffleStudents/:teacherName", async (req, res)=>{

  var fullName = req.params.teacherName;
  var firstName=  fullName.split(';')[0];
  var lastName = fullName.split(";")[1];

  var allStudents = await Signup.find({}, 'shuffleStudents firstName lastName roomNumber floorName');
  
  const filteredStudents = allStudents.filter(student => student.shuffleStudents.length > 0);
  const filteredStudentsByTeacher = filteredStudents.filter(student => student.firstName === firstName && student.lastName === lastName);
  
  res.status(200).send(filteredStudentsByTeacher);
})

app.get("/allShuffleStudentsTeachers", async (req, res)=>{
  var allStudents = await Signup.find({}, 'firstName lastName shuffleStudents floorName');

  var floors = ["b","c","d"];
  var floorsDetected = [];

  for(let i = 0; i < allStudents.length; i++){
      for(let j = 0; j < floors.length; j++){
        if(allStudents[i].floorName === floors[j]){
          if(!floorsDetected.includes(allStudents[i].floorName)){
            floorsDetected.push(allStudents[i].floorName);
          }
        }
      }
  }
  
  const filteredStudents = allStudents.filter(student => student.shuffleStudents.length > 0);

  if(filteredStudents.length > 0){
    res.status(200).send({
      filteredStudents,
      floorsDetected
    });
  }
  else{
    res.status(404).send("No information found!");
  }

})

  // app.put("/attendance/:teacherId/:studentId", async (req, res)=>{
  //   try{
  //     var teacherId = req.params.teacherId;
  //     var studentId = req.params.studentId;
  //     console.log(studentId);

  //     var status = req.body.status;

  //     var findTeacher = await Signup.findById(teacherId);

  //     var chk = false;

  //     for(let i = 0; i < findTeacher.shuffleStudents.length; i++){
  //           for(let j = 0; j < findTeacher.shuffleStudents[i].names.length; j++){

  //             if(findTeacher.shuffleStudents[i].names[j]._id.toString() === studentId){

  //               findTeacher.shuffleStudents[i].names[j].attendance = status;
  //               await findTeacher.save();
  //               chk = true;
  //               break;
  //             }
  //           }
  //     }

  //     if(chk){
  //       res.status(200).send("Attendance Marked Successfully!");
  //     }
  //     else{
  //       res.status(404).send("Something went wrong!");
  //     }
  //   }

  //   catch(e){
  //     res.status(404).send(e);
  //   }



  // })

  app.put("/attendance/:teacherId/:studentId", async (req, res) => {
    try {
      const teacherId = req.params.teacherId;
      const studentId = req.params.studentId;
      const status = req.body.status;
  
      const result = await Signup.findByIdAndUpdate(
        teacherId,
        {
          $set: {
            "shuffleStudents.$[i].names.$[j].attendance": status,
          },
        },
        {
          arrayFilters: [{ "i.names._id": studentId }, { "j._id": studentId }],
        }
      );
  
      if (result) {
        res.status(200).send("Attendance Marked Successfully!");
      } else {
        res.status(404).send("Teacher or student not found!");
      }
    } catch (e) {
      res.status(500).send(e);
    }
  });

  // ======================== SHUFFLE STUDENTS ATTENDANCE DATA START =============================

  app.post("/attendanceData", async (req, res)=>{

    var findStudent = await ShuffleStudents.findOne({studentId: req.body.studentId});

    if(findStudent){
      var updateData = await ShuffleStudents.findOneAndUpdate({studentId: req.body.studentId}, req.body, {
        new: true
      })
      res.status(200).send(updateData);
    }

    else{
      var createData = new ShuffleStudents(req.body);
      createData.save().then(()=>{
        res.status(200).send(createData);
      }).catch((e)=>{
        res.status(404).send(e);
      })
    }

  })

  app.get("/shuffleAttendance/:date", async (req, res)=>{
    
    var date =  req.params.date;
    var allStudents = await ShuffleStudents.find({date: date});
    res.status(200).send(allStudents);
  })


  app.delete("/resetAllAttendance", async (req, res)=>{
    try{
      var deleteAll = await Signup.updateMany({}, {
       $unset: {
        absentStatus: "",
        shuffleStudents: ""
       } 
      })

      res.status(200).send(deleteAll);

    } 
    catch{
      res.status(404).send("Something went wrong!");
    }   
  })




  setInterval(async ()=>{
    await Signup.updateMany({}, {
      $unset: {
       absentStatus: "",
       shuffleStudents: ""
      } 
     })
  }, 43200000)

  
  // ======================== SHUFFLE STUDENTS ATTENDANCE DATA END =============================


  app.get("/adminRequests", async (req,res)=>{
    try{
      const findAdmins = await Signup.find({adminStatus: "pending", accountType: "admin"});
      res.status(200).send(findAdmins);
    }
    catch{
      res.status(500).send("Server Error");
    }
  })

  app.put("/adminRequests/:id", async (req, res)=>{
    try{
      const _id = req.params.id;

      const editUser = await Signup.findByIdAndUpdate(_id, req.body, {
        new: true
      })

      res.status(200).send(editUser)
    }
    catch{
      res.status(500).send("Server Crashed!");
    }
  })


app.listen(port, () => {
  console.log("API is running on port: " + port);
});

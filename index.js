const express = require("express");
const cors =  require('cors')
const { connection } = require("./config/db");
const { UserModel } = require("./models/UserModel");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { authentication } = require("./middlewares/authentication");
const { BMIModel } = require("./models/BMIModel");


require("dotenv").config();

const app = express();
app.use(cors())

// Syntax: app.use([path,],callback[,callback…])
// app.use((req, res, next)
app.use(express.json()); // THIS WILL PARSE THE RESPONSE

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;   // destructure the response received

  const isUser =  await UserModel.findOne({email})
 
  if(isUser){
    res.send({'msg':'User already exists, try logging in'})
  }


  bcrypt.hash(password, 5, async function(err, hash) {
   // Store hash in your password DB.

    if(err){
      res.send("Something went wrong please try again");
      console.log('err', err)
    }
    else{

      const new_user = new UserModel({
         name,
         email,
         password : hash
       });
     
       try {
         await new_user.save(); // if dont want to use insertMany u can use this.
         res.send("Signup Successful");
       } catch (error) {
         res.send("Something went wrong please try again");
         console.log('error', error)
       }
    }  

  });
 
});


app.post('/login', async(req, res) => {

    const {email, password} = req.body
    const user = await UserModel.findOne({email}) // await is important here so it will give the result
    const hashed_password = user.password


    bcrypt.compare(password, hashed_password, function(err, result) {
      
      if(err){
         res.send({'msg':'Something went wrong, try again later'})
      }


      if(result){

         const user_id = user._id;

        // Making token here passing user ID
         var token = jwt.sign({ user_id }, process.env.SECRET_KEY);
         res.send({message : 'Login Successfull', token : token})

         console.log(user_id)
      }
      else{

         res.send('Login Failed')

      }
    });
})


app.get('/getProfile', authentication, async(req, res) => {

   const {user_id} = req.body
   const user = await UserModel.findOne({_id : user_id})

   const {name, email} = user

   res.send({name, email})

})


app.post('/calculateBMI', authentication, async(req, res) => {

  const {height, weight, user_id} = req.body
 
  console.log(height, weight, user_id, "calcbmi")

  const height_in_metre = Number(height)* 0.3048

  const BMI =  Number(weight/ (height_in_metre)**2)
  const new_bmi = new BMIModel({
      BMI,
      height : height_in_metre,
      weight,
      user_id
  })

  await new_bmi.save()

  res.send({'msg':BMI})

})

app.get('/getCalculation', authentication, async(req, res) => {

   const {user_id} = req.body
   const all_bmi = await BMIModel.find({user_id : user_id})
   res.send({history : all_bmi})
 
 })

// Syntax: app.get(path, callback)
app.get("/", (req, res) => {
  res.send({'msg':"HELLO"}); //response will be shown
});


// app.listen([port[, host[, backlog]]][, callback])

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connection to DB successfully");
  } catch (error) {
    console.log("Error connecting to DB");
    console.log(error);
  }

  console.log("Listening Port 3001");
});

const mongoose = require('mongoose')

// Always use new keyword

const bmiShema = new mongoose.Schema({

  BMI : {type : Number, required : true},
  height : {type : String, required : true},
  weight : {type : String, required : true},
  user_id : {type : String, required : true}
},{
    timestamps : true
})


const BMIModel = mongoose.model('bmi', bmiShema)  

module.exports =  {BMIModel}




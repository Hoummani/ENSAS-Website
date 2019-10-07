const mongoose = require('mongoose');

const Schema=mongoose.Schema;

const UserSchema=new Schema({
  firstName:{
    type:String,
    required:true
  },
  lastName:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  photo:{
    type:String
  },
  cin:{
    type:String
  },
  cne:{
    type:String
  },
  firstNameAr:{
    type:String
  },
  lastNameAr:{
    type:String
  },
  birthDay:{
    type:String
  },
  birthPlace:{
    type:String
  },
  address:{
    type:String
  },
  nationality:{
    type:String
  },
  phone:{
    type:String
  },
  fatherFullName:{
    type:String
  },
  fatherJob:{
    type:String
  },
  motherFullName:{
    type:String
  },
  motherJob:{
    type:String
  },
  parentAddress:{
    type:String
  },
  parentPhone:{
    type:String
  },
  level:{
    type:String
  },
  filiere:{
    type:String
  },
  bacType:{
    type:String
  },
  mention:{
    type:String
  },
  bacGetYear:{
    type:String
  },
  bacLycee:{
    type:String
  },
  bacDirection:{
    type:String
  },
  bacAccademie:{
    type:String
  }

});

const User=mongoose.model('User',UserSchema);
module.exports=User;
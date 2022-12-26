const jwt =  require('jsonwebtoken')

require('dotenv').config()


const authentication = (req, res, next) => {

//  console.log('req', req.headers)

 const token = req.headers?.authorization.split(' ')[1]

//  console.log('token', token)

 if(!token){
    res.send({'msg':'Please login'})
 }

 var decoded = jwt.verify(token, process.env.SECRET_KEY);
 const user_id = decoded.user_id

 if(decoded){

    req.body.user_id =  user_id    //Very important. This is done to pass the userid 
    next()
 }
 else{
    res.send({'msg':'Please login'})
 }

}



module.exports =  {authentication}
var express = require('express');
var app = express();

//--------  GraphQL  ---------//




app.use('/', (req,res,next)=>{
    res.send('Preparing to graphql !');
});
//-------- end GraphQL  -----//

//--------- Database  --------//


//--------- end database   ----//




//----------  app config  ------ //
app.listen(4200,()=>{
    console.log("Your app is listen now to port 4200 !");
});
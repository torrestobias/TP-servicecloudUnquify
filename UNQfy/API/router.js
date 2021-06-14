const express = require('express');
const app = express();
const router = express.Router();
const {artistController} = require('./artistController');
artistController.use(express.json);

router.get('/', function(req,res){
    res.json({message: 'anda la mierda'})
});

app.use('/api', artistController);
app.listen(8000, ()=>{
    console.log("El servidor está inicializado en el puerto 3000");
})
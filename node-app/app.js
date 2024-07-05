/* jslint es6:true */
import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();
const port = 3000
const secretKey = "Malooo"

app.use(express.json())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
app.use(cors());


function verifyToken(req,res, next) {
  const header = req.header("Authorization") || "";
  const token = header.split(" ")[1];
  if(!token){
    return res.status(401).json({message: "Token not provided"});
  }
  try {
    const payload = jwt.verify(token, secretKey);
    req.username = payload.username;
    next();
  } catch (error) {
    return res.status(403).json({message:"Token no valido"});
  }
}

app.get('/', (req,res)=>{
  res.send('Si jala')
})

app.post("/login", (req,res) =>{
try {
  const username = req.body.username;
  const password = req.body.password;
  if(!username || !password){
    return res.status(400).json({message:"usuario y contraseña requeridos"});
  }
  if(username === "admin" && password === "123"){
    const token = jwt.sign({username}, secretKey, {expiresIn: "1h"});
    return res.status(200).json({token});
  }else{
    return res.status(401).json({message: "Falló la autenticación"})
  }
}catch(error){
  return res.status(500).json({message: "internal server error"});
}
});


app.get("/protected", verifyToken, (req,res) =>{
  return res.status(200).json({message: "Ya tienes acceso"});
});

app.listen(port, () => {
  console.log(`Servicio corriendo en http://localhost:${port}`)
})
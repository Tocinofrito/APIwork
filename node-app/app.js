/* jslint es6:true */
import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

const app = express();
const port = 3000;
const secretKey = "Malooo";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Esquemas
//esquema empleado
const empleadoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  apartamento: { type: String, required: true },
  edad: { type: Number, required: true },
  empleadoId: { type: Number, required: true }
}, { collection: 'Empleados'});

//Middlewares
app.use(express.json());
app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}));
app.use(cookieParser());

//Todos los archivos los está dando desde su carpeta /views, no desde la carpeta propia de la vista ###CONSIDERALO###
app.use(express.static(path.join(__dirname, 'views')));


function verifyToken(req, res, next) {
  const token = req.cookies.Authorization;
  if (!token) {
    res.sendFile(path.join(__dirname, 'views', 'login', 'index.html'));
    return res.status(401).json({ message: "Token not provided" });
  }
  try {
    const payload = jwt.verify(token, secretKey);
    req.username = payload.username;
    console.log('try of verifytoken()');
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: "Token no valido" });
  }
}

function connectDB() {
  try {
    mongoose.connect('mongodb://mongo:27017/Empleados').then(() => console.log('Conectado a mongo'))
      .catch(err => console.log('Error al conectar a mongo:', err));
  } catch (error) {
    console.log('Error en connectDB function:', error);
  }
}

connectDB();


//Función para obtener token, redirecciona a /protected que se encarga de mostrar los datos de la db
app.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Usuario y contraseña requeridos" });
    }
    if (username === "admin" && password === "123") {
      const token = jwt.sign(
        { username },
        secretKey,
        { expiresIn: "1h" }
      );
      res.cookie('Authorization', token, {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60
      });
      return res.status(200).json({ message: "Autenticación exitosa" });
    } else {
      return res.status(401).json({ message: "Falló la autenticación" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error: " + error });
  }
});

app.get('/getData', verifyToken, async (req, res) => {
  const Empleado = mongoose.model('Empleado', empleadoSchema);
  try {
    const empleados = await Empleado.find();
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ message: "No se pudo traer datos de Empleados: " + error });
  }
});

app.post('/addData', verifyToken, async(req,res) =>{
  try {
    const Empleado = mongoose.model('Empleado', empleadoSchema)
    const {nombre, apellido, apartamento, edad, empleadoId} = req.body;
    const newEmpleado = new Empleado({nombre, apellido, apartamento, edad, empleadoId});
    await newEmpleado.save();
    res.status(201).json({message: "Empleado agregado"})
  } catch (error) {
    res.status(500).json({message: "Error al agregar empleado: " + error});
  }
})
// Rutas con vistas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login', 'index.html'));
});

app.get("/protected", verifyToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'show', 'index.html'));
});

app.get("/crud", verifyToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'crud', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servicio corriendo en http://localhost:${port}`);
});

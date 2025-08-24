//* paso 1, importar modulos necesarios/

const express = require('express');       // para crear el servidor
const nodemailer = require('nodemailer'); // para enviar mails
const cors = require('cors');             // para permitir llamadas desde otro dominio (como Vercel)
require('dotenv').config();               // para leer variables de .env


//* paso 2, configurar el servidor
const app = express();
const PORT = process.env.PORT || 3000; //entra en todas las variables y si no hay definida, usa el puerto 3001 localmente




//* paso 3, agrega middlewares
app.use(cors());  //permite que tu frontend (que está en otra web, como Vercel) pueda hacer peticiones.
app.use(express.json());  //permite que el servidor entienda los datos que llegan en formato JSON (como { name, subject, message }gmail).





//* paso 4, definir rutas POST

app.post('/send', async (req, res) => {
    const { email, message } = req.body; //el backend recibe los datos que el usuario escribió en el formulario, gracias a req.body, y después los usa para enviarte un correo. desde el front (app.js)
    
    //*paso 5, configura nodemailer y envia el correo
    try {
    const transporter = nodemailer.createTransport({ //quiero conectarme a mi casilla para mandar un mail desde ahí (service:gmail)
        service: 'gmail',
        auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, //Le pasa tu cuenta y contraseña segura (process.env.EMAIL_USER/PASS Toma los datos desde el archivo .env)
    },
    });

    const mailOptions = { //Prepara el contenido del email con lo que te mandaron desde el formulario.
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `Mensaje de: ${email} `,
        text: message,
    }; 

    await transporter.sendMail(mailOptions); //Esta línea envía el correo usando la configuración y con los datos preparados en mailOptions. await espera a que se mande el mail
    res.status(200).json({ success: true, message: 'Mensaje enviado con éxito.' });// El servidor le responde al frontend que todo salió bien (con código 200 y un JSON)
    } catch (error) {
    console.error(error); 
    res.status(500).json({ success: false, message: 'Error al enviar el mensaje.' });//Y le responde al frontend un error 500 (fallo interno del servidor).
    } //¿Y para qué sirve responder? try catch Para que en el frontend puedas mostrar un mensaje como:  “Gracias, tu mensaje fue enviado” o “Ocurrió un error, intentá más tarde”
});


//* Inicio del servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); //(se queda escuchando peticiones) 


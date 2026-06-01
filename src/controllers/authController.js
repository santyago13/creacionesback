const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Hash generado una vez al arrancar el servidor para no guardar la contraseña en texto plano
const passwordHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);

const login = async (req, res) => {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
        return res.status(400).json({ message: 'Usuario y contraseña son requeridos.' });
    }

    if (usuario !== process.env.ADMIN_USUARIO) {
        return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    const passwordCorrecta = await bcrypt.compare(password, passwordHash);
    if (!passwordCorrecta) {
        return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    const token = jwt.sign({ usuario }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
};

module.exports = { login };

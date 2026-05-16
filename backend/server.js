const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
const port = process.env.PORT || 4000;

function formatFoto(foto) {
  if (foto == null) {
    return null;
  }

  let text = null;

  // Si es un Buffer, convertir a string
  if (Buffer.isBuffer(foto)) {
    text = foto.toString('utf8');
  } else if (foto.type === 'Buffer' && Array.isArray(foto.data)) {
    text = Buffer.from(foto.data).toString('utf8');
  } else if (typeof foto === 'string') {
    text = foto;
  }

  if (!text) {
    return null;
  }

  // Si ya es un data URL válido, devolverlo tal cual
  if (text.startsWith('data:')) {
    return text;
  }

  // Si es base64 válido (solo caracteres alfanuméricos, +, /, =)
  if (/^[A-Za-z0-9+/=]+$/.test(text)) {
    return `data:image/jpeg;base64,${text}`;
  }

  // Si es hex, decodificar primero
  if (/^[0-9a-fA-F]+$/.test(text)) {
    const decoded = Buffer.from(text, 'hex').toString('utf8');
    if (decoded.startsWith('data:')) {
      return decoded;
    }
    if (/^[A-Za-z0-9+/=]+$/.test(decoded)) {
      return `data:image/jpeg;base64,${decoded}`;
    }
  }

  return null;
}

function mapPersona(persona) {
  return {
    ...persona,
    foto: formatFoto(persona.foto),
  };
}

app.get('/api/personas', async (req, res) => {
  try {
    const personas = await db.query('SELECT id, nombre, apellido, ciudad, foto FROM persona');
    const personasConFotos = personas.map(mapPersona);
    res.json({ success: true, data: personasConFotos });
  } catch (error) {
    console.error('Error fetching personas:', error);
    res.status(500).json({ success: false, error: 'No se pudo obtener la lista de personas' });
  }
});

app.get('/api/personas/:id', async (req, res) => {
  const { id } = req.params;
  console.log('GET /api/personas/:id called with id=', id);

  if (!/^[0-9]+$/.test(id)) {
    return res.status(400).json({ success: false, error: 'ID inválido' });
  }

  try {
    const persona = await db.query(
      'SELECT id, nombre, apellido, ciudad, foto FROM persona WHERE id = ?',
      [id]
    );

    if (persona.length === 0) {
      return res.status(404).json({ success: false, error: 'Persona no encontrada' });
    }

    res.json({ success: true, data: mapPersona(persona[0]) });
  } catch (error) {
    console.error('Error fetching persona by id:', error);
    res.status(500).json({ success: false, error: 'No se pudo obtener la persona' });
  }
});

app.get('/api/formacion', async (req, res) => {
    console.log('entra /api/formacion called');
  try {
    const formacion = await db.query(
      'SELECT f.id, f.titulo, f.institucion, f.anio, f.persona_id, p.nombre AS persona_nombre, p.apellido AS persona_apellido FROM formacion f LEFT JOIN persona p ON f.persona_id = p.id'
    );
    res.json({ success: true, data: formacion });
  } catch (error) {
    console.error('Error fetching formacion:', error);
    res.status(500).json({ success: false, error: 'No se pudo obtener la lista de formación' });
  }
});

app.get('/api/formacion/:id', async (req, res) => {
  const { id } = req.params;
  console.log('GET /api/formacion/:id called with id=', id);

  if (!/^[0-9]+$/.test(id)) {
    return res.status(400).json({ success: false, error: 'ID inválido' });
  }

  try {
    const formacion = await db.query(
      'SELECT f.id, f.titulo, f.institucion, f.anio, f.persona_id, p.nombre AS persona_nombre, p.apellido AS persona_apellido FROM formacion f LEFT JOIN persona p ON f.persona_id = p.id WHERE f.id = ?',
      [id]
    );

    if (formacion.length === 0) {
      return res.status(404).json({ success: false, error: 'Formación no encontrada' });
    }

    res.json({ success: true, data: formacion[0] });
  } catch (error) {
    console.error('Error fetching formacion by id:', error);
    res.status(500).json({ success: false, error: 'No se pudo obtener la formación' });
  }
});

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Backend Node.js conectado y listo' });
});

app.listen(port, () => {
  console.log(`Backend escuchando en http://localhost:${port}`);
});

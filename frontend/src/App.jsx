import { useEffect, useState } from 'react';

const apiBase = import.meta.env.VITE_API_URL || '';

function App() {
  const [personas, setPersonas] = useState([]);
  const [formacion, setFormacion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [personasRes, formacionRes] = await Promise.all([
          fetch(`${apiBase}/api/personas`),
          fetch(`${apiBase}/api/formacion`),
        ]);

        if (!personasRes.ok || !formacionRes.ok) {
          throw new Error('No se pudieron cargar los datos desde el backend');
        }

        const personasJson = await personasRes.json();
        const formacionJson = await formacionRes.json();

        setPersonas(personasJson.data || []);
        setFormacion(formacionJson.data || []);
      } catch (err) {
        console.error(err);
        setError('Error al cargar los datos. Verifica que el backend esté ejecutándose.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="app-shell">Cargando currículum...</div>;
  }

  if (error) {
    return <div className="app-shell error">{error}</div>;
  }

  return (
    <div className="app-shell">
      <header>
        <h1>Currículum Personal</h1>
        <p>Información personal y formación académica</p>
      </header>

      <section className="card personal-card">
        <h2>Datos personales</h2>
        {personas.length === 0 ? (
          <p>No hay datos personales disponibles.</p>
        ) : (
          personas.map((persona) => (
            <div key={persona.id} className="item">
              <div>
                <strong>{persona.nombre} {persona.apellido}</strong>
                <span> {persona.ciudad}</span>
              </div>
              {persona.foto && <img src={persona.foto} alt={`${persona.nombre} ${persona.apellido}`} />}
            </div>
          ))
        )}
      </section>

      <section className="card formacion-card">
        <h2>Formación académica</h2>
        {formacion.length === 0 ? (
          <p>No hay formación registrada.</p>
        ) : (
          <ul>
            {formacion.map((item) => (
              <li key={item.id}>
                <div className="formacion-title">{item.titulo}</div>
                <div className="formacion-meta">
                  <span>{item.institucion}</span>
                  <span>{item.anio}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;

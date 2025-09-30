import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAll, deleteDoc } from '../api/docs.js';

export default function List() {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    fetchDocs();
  }, []);

  async function fetchDocs() {
    const data = await getAll();
    setDocs(data);
  }

  async function handleDelete(id) {
    if (confirm('Är du säker att du vill ta bort?')) {
      await deleteDoc(id);
      fetchDocs();
    }
  }

  return (
    <div>
      <h2>Dokument</h2>
      <Link to="/new">Skapa nytt dokument</Link>
      <ul>
        {docs.map((doc) => (
          <li key={doc._id}>
            <Link to={`/${doc._id}`}>{doc.title}</Link>{' '}
            <button onClick={() => handleDelete(doc._id)}>Radera</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

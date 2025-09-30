import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createDoc, getOne, updateDoc } from '../api/docs.js';

export default function Doc() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Bestäm om det är nytt dokument baserat på URL
  const isNew = !id;

  useEffect(() => {
    if (!isNew && id) {
      getOne(id)
        .then((doc) => {
          setTitle(doc.title);
          setContent(doc.content);
        })
        .catch((err) => {
          console.error('Kunde inte hämta dokument:', err);
          alert('Kunde inte hämta dokument. Kolla konsolen.');
        });
    }
  }, [id, isNew]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title || !content) {
      alert('Titel och Innehåll måste fyllas i');
      return;
    }

    try {
      if (isNew) {
        const res = await createDoc({ title, content });
        console.log('Skapat dokument:', res);
      } else {
        const res = await updateDoc(id, { title, content });
        console.log('Uppdaterat dokument:', res);
      }
      navigate('/');
    } catch (err) {
      console.error('Fel vid skapande/uppdatering:', err);
      alert(`Något gick fel: ${err.message}`);
    }
  }

  return (
    <div className="container">
      <h2>{isNew ? 'Skapa nytt dokument' : 'Redigera dokument'}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Titel
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          Innehåll
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </label>

        <button type="submit">{isNew ? 'Skapa' : 'Uppdatera'}</button>
      </form>
    </div>
  );
}

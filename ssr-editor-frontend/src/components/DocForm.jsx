export default function DocForm({ title, content, setTitle, setContent, onSubmit, isNew }) {
  return (
    <form onSubmit={onSubmit}>
      <label>
        Titel
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <label>
        Innehåll
        <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      </label>
      <button type="submit">{isNew ? 'Skapa' : 'Uppdatera'}</button>
    </form>
  );
}

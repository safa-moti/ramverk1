const BASE = import.meta.env.VITE_API_BASE;

if (!BASE) console.error("VITE_API_BASE saknas! Kontrollera .env");

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

export async function getAll() {
  console.log("Fetching all documents from:", `${BASE}/documents`);
  const res = await fetch(`${BASE}/documents`);
  return handleResponse(res);
}

export async function getOne(id) {
  console.log("Fetching document:", `${BASE}/documents/${id}`);
  const res = await fetch(`${BASE}/documents/${id}`);
  return handleResponse(res);
}

export async function createDoc(payload) {
  console.log("Creating document:", `${BASE}/documents`, payload);
  try {
    const res = await fetch(`${BASE}/documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  } catch (err) {
    console.error("createDoc failed:", err);
    throw err;
  }
}

export async function updateDoc(id, payload) {
  console.log("Updating document:", `${BASE}/documents/${id}`, payload);
  try {
    const res = await fetch(`${BASE}/documents/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  } catch (err) {
    console.error("updateDoc failed:", err);
    throw err;
  }
}

export async function deleteDoc(id) {
  console.log("Deleting document:", `${BASE}/documents/${id}`);
  try {
    const res = await fetch(`${BASE}/documents/${id}`, { method: "DELETE" });
    return handleResponse(res);
  } catch (err) {
    console.error("deleteDoc failed:", err);
    throw err;
  }
}

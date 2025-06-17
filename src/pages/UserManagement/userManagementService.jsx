import { useContext, React } from 'react'
import { getAuthToken } from "../Login/loginService";

const API_BASE = "http://localhost:8080/api/users";


export async function fetchUsersFromApi({ page, size, sortField, sortDir, search }, showError) {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortField: `${sortField}`,
    sortOrder: `${sortDir}`,
  });
  if (search) params.append("search", search);

  const res = await fetch(`${API_BASE}?${params}`, {
      method: "GET", 
      headers: {"Authorization": `Bearer ${getAuthToken()}`}
  });
  if (!res.ok) {
    let json = await res.json();
    if (showError) showError(json.error);
    throw new Error("Failed to fetch users");
  }
  return await res.json();
}

export async function fetchUserById(id, showError) {
  const res = await fetch(`${API_BASE}/${id}`, {
      headers: {"Authorization": `Bearer ${getAuthToken()}`}
  });
  if (!res.ok) { 
    let json = await res.json();
    if (showError) showError(json.error);
    throw new Error(error);
  }
  return await res.json();
}

export async function saveUser(user, showError) {
  const isEditing = !!user.id;
  const url = isEditing ? `${API_BASE}/${user.id}` : API_BASE;
  const method = isEditing ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getAuthToken()}` },
    body: JSON.stringify(user),
  });

  if (!res.ok) { 
    let json = await res.json();
    if (showError) showError(json.error);
    throw new Error("Failed to save user");
  }
  return await res.json();
}

export async function deleteUser(id, showError) {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE", headers: {"Authorization": `Bearer ${getAuthToken()}`}  });
  if (!res.ok) {
    let json = await res.json();
    if (showError) showError(json.error); 
    throw new Error("Failed to delete user");
  }
}

export async function updateUserPassword(id, newPassword, showError) {
  const res = await fetch(`${API_BASE}/${id}/password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getAuthToken()}`  },
    body: JSON.stringify({ passkey: newPassword }),
  });
  if (!res.ok) {
    let json = await res.json();
    if (showError) showError(json.error); 
    throw new Error("Failed to update password");
  } 
}

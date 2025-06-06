const API_BASE = "http://localhost:8080/api/users";

export async function fetchUsersFromApi({ page, size, sortField, sortDir, search }) {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort: `${sortField},${sortDir}`,
  });
  if (search) params.append("search", search);

  const res = await fetch(`${API_BASE}?${params}`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return await res.json();
}

export async function fetchUserById(id) {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return await res.json();
}

export async function saveUser(user) {
  const isEditing = !!user.id;
  const url = isEditing ? `${API_BASE}/${user.id}` : API_BASE;
  const method = isEditing ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!res.ok) throw new Error("Failed to save user");
  return await res.json();
}

export async function deleteUser(id) {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete user");
}

export async function updateUserPassword(id, newPassword) {
  const res = await fetch(`${API_BASE}/${id}/password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ passkey: newPassword }),
  });
  if (!res.ok) throw new Error("Failed to update password");
}

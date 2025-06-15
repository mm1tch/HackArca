const BASE_URL = "http://10.22.190.201:3000";

export async function getUser(userId: string) {
  const res = await fetch(`${BASE_URL}/api/users/${userId}`);
  if (!res.ok) {
    throw new Error("Error al obtener usuario");
  }
  return await res.json();
}

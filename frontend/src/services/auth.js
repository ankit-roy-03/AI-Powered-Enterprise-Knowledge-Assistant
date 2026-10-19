const AUTH_KEY = "enterprise_ai_user";

export const DEMO_CREDENTIALS = {
  email: "admin@company.com",
  password: "admin123",
};

export function getCurrentUser() {
  try {
    const user = localStorage.getItem(AUTH_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Unable to read saved user:", error);
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getCurrentUser());
}

export function login({ email, password }) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedPassword = String(password || "").trim();

  if (
    normalizedEmail !== DEMO_CREDENTIALS.email ||
    normalizedPassword !== DEMO_CREDENTIALS.password
  ) {
    throw new Error(
      "Invalid email or password. Use admin@company.com / admin123."
    );
  }

  const user = {
    name: "Admin User",
    email: DEMO_CREDENTIALS.email,
    role: "Administrator",
  };

  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

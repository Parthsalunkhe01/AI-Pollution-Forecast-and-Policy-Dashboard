// src/services/authService.js

export const authService = {
  login: async (email, password) => {
    // Simulate API delay
    await new Promise((res) => setTimeout(res, 300));

    // Mock "database check"
    if (!email || !password) {
      throw new Error("Missing credentials");
    }

    // Generate a fake token
    const token = btoa(`${email}:${Date.now()}`);

    // Determine role
    const role = email.includes("admin") ? "admin" : "user";

    // Save token locally
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({ email, role }));

    return {
      user: {
        email,
        role,
      },
      token,
    };
  },

  signup: async ({ name, email, password, role }) => {
    await new Promise((res) => setTimeout(res, 300));

    if (!email || !password) {
      throw new Error("Missing fields");
    }

    const token = btoa(`${email}:${Date.now()}`);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({ name, email, role }));

    return {
      user: { name, email, role },
      token,
    };
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isLoggedIn: () => {
    return !!localStorage.getItem("token");
  },
};

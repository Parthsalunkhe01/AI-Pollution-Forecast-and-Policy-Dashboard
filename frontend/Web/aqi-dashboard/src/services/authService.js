export const authService = {
  login: async (email, password) => {
    await new Promise((r) => setTimeout(r, 400));
    return {
      user: {
        name: 'Demo User',
        email,
        role: email.includes('admin') ? 'admin' : 'user'
      }
    };
  },

  signup: async ({ name, email, password, role }) => {
    await new Promise((r) => setTimeout(r, 400));
    return {
      user: {
        name,
        email,
        role: role || 'user'
      }
    };
  }
};

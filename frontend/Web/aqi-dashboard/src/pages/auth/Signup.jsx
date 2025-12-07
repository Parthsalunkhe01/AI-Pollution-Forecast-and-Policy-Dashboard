import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';

const Signup = ({ onSuccess }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await authService.signup(form);
      onSuccess(user);
      toast.success('Account created');
    } catch {
      toast.error('Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-xl font-semibold mb-1 text-slate-900">Create account</h1>
        <p className="text-sm text-slate-500 mb-6">Join to monitor Delhi-NCR air quality.</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs font-medium text-slate-600">Full name</label>
            <input
              className="input mt-1"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Email</label>
            <input
              className="input mt-1"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Password</label>
            <input
              className="input mt-1"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Role</label>
            <select
              className="input mt-1"
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button className="btn-primary w-full mt-2" disabled={loading}>
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-500">
          Already have an account?{' '}
          <a href="/login" className="text-primary-600 font-medium">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;

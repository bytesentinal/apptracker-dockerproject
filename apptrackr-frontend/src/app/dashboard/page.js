'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', status: 'in_progress' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (user) fetchProjects();
  }, [user, loading]);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch {
      setError('Failed to load projects');
    }
  };

  const createProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', form);
      setForm({ title: '', description: '', status: 'in_progress' });
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  const deleteProject = async (id) => {
    await api.delete(`/projects/${id}`);
    fetchProjects();
  };

  if (loading) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Hey, {user?.name} 👋</h1>
          <button onClick={logout}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm transition">
            Logout
          </button>
        </div>

        {/* Create project form */}
        <div className="bg-gray-900 p-6 rounded-xl mb-8">
          <h2 className="text-lg font-semibold mb-4">New Project</h2>
          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          <form onSubmit={createProject} className="space-y-3">
            <input className="w-full bg-gray-800 px-4 py-3 rounded-lg outline-none"
              placeholder="Project title" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} required />
            <input className="w-full bg-gray-800 px-4 py-3 rounded-lg outline-none"
              placeholder="Description" value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} />
            <select className="w-full bg-gray-800 px-4 py-3 rounded-lg outline-none"
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
            </select>
            <button type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg font-medium transition">
              Add Project
            </button>
          </form>
        </div>

        {/* Projects list */}
        <div className="space-y-4">
          {projects.length === 0 && <p className="text-gray-500">No projects yet.</p>}
          {projects.map(p => (
            <div key={p.id} className="bg-gray-900 p-5 rounded-xl flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{p.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{p.description}</p>
                <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300">
                  {p.status.replace('_', ' ')}
                </span>
              </div>
              <button onClick={() => deleteProject(p.id)}
                className="text-red-400 hover:text-red-300 text-sm ml-4 transition">
                Delete
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
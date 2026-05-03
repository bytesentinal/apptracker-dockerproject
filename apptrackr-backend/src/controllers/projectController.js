const pool = require('../config/db');
const ActivityLog = require('../models/ActivityLog');

// helper to log to MongoDB
const log = (userId, action, entityId, meta = {}) => {
  ActivityLog.create({ userId, action, entity: 'project', entityId, meta })
    .catch(err => console.error('Log error:', err.message));
};

// GET all projects for logged-in user
exports.getProjects = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET single project
exports.getProject = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Project not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// CREATE project
exports.createProject = async (req, res) => {
  const { title, description, status, tags } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO projects (user_id, title, description, status, tags)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.user.id, title, description, status || 'in_progress', tags || []]
    );
    const project = result.rows[0];
    log(req.user.id, 'CREATE_PROJECT', project.id, { title });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// UPDATE project
exports.updateProject = async (req, res) => {
  const { title, description, status, tags } = req.body;
  try {
    const existing = await pool.query(
      'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (existing.rows.length === 0) return res.status(404).json({ message: 'Project not found' });

    const result = await pool.query(
      `UPDATE projects SET title=$1, description=$2, status=$3, tags=$4, updated_at=NOW()
       WHERE id=$5 AND user_id=$6 RETURNING *`,
      [
        title || existing.rows[0].title,
        description || existing.rows[0].description,
        status || existing.rows[0].status,
        tags || existing.rows[0].tags,
        req.params.id,
        req.user.id
      ]
    );
    const project = result.rows[0];
    log(req.user.id, 'UPDATE_PROJECT', project.id, { before: existing.rows[0], after: project });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE project
exports.deleteProject = async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Project not found' });
    log(req.user.id, 'DELETE_PROJECT', parseInt(req.params.id), { title: result.rows[0].title });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET activity log for logged-in user (from MongoDB)
exports.getActivityLog = async (req, res) => {
  try {
    const logs = await ActivityLog.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
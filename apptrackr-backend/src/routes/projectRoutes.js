const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getActivityLog
} = require('../controllers/projectController');

router.use(protect); // all project routes require auth

router.get('/', getProjects);
router.get('/activity', getActivityLog);
router.get('/:id', getProject);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

module.exports = router;
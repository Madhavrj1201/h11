const express = require('express');
const router = express.Router();
const CodeRoom = require('../models/CodeRoom');
const { auth } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

// Create code room
router.post('/', auth, asyncHandler(async (req, res) => {
  const { title, description, language } = req.body;
  
  const codeRoom = await CodeRoom.create({
    title,
    description,
    participants: [{
      user: req.user._id,
      role: 'host'
    }],
    code: {
      content: '',
      language: language || 'javascript'
    }
  });
  
  res.status(201).json(codeRoom);
}));

// Join code room
router.post('/:id/join', auth, asyncHandler(async (req, res) => {
  const room = await CodeRoom.findById(req.params.id);
  
  if (!room) {
    return res.status(404).json({ error: 'Code room not found' });
  }
  
  if (room.isFull) {
    return res.status(400).json({ error: 'Room is full' });
  }
  
  room.participants.push({
    user: req.user._id,
    role: 'participant'
  });
  
  await room.save();
  res.json(room);
}));

// Get code room
router.get('/:id', auth, asyncHandler(async (req, res) => {
  const room = await CodeRoom.findById(req.params.id)
    .populate('participants.user', 'username profile.firstName profile.lastName');
  
  if (!room) {
    return res.status(404).json({ error: 'Code room not found' });
  }
  
  res.json(room);
}));

// Update code
router.put('/:id/code', auth, asyncHandler(async (req, res) => {
  const { content } = req.body;
  const room = await CodeRoom.findById(req.params.id);
  
  if (!room) {
    return res.status(404).json({ error: 'Code room not found' });
  }
  
  room.addToHistory(content, req.user._id);
  room.code.content = content;
  room.code.lastUpdated = new Date();
  
  await room.save();
  res.json(room);
}));

// Send chat message
router.post('/:id/chat', auth, asyncHandler(async (req, res) => {
  const { message, type = 'text' } = req.body;
  const room = await CodeRoom.findById(req.params.id);
  
  if (!room) {
    return res.status(404).json({ error: 'Code room not found' });
  }
  
  room.chat.push({
    user: req.user._id,
    message,
    type
  });
  
  await room.save();
  res.json(room.chat[room.chat.length - 1]);
}));

module.exports = router;
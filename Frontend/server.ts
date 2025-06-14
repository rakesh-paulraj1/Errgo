import express from 'express';
import cors from 'cors';
import { IProject, ProjectSchema } from './models/project.interface';
import { v4 as uuid } from 'uuid';
import { ZodError } from 'zod';
import { Server } from 'socket.io';
import { createServer } from 'node:http';

const app = express();
const PORT = 4000;

// List of projects
const projects: IProject[] = [];

// Create HTTP server with Express app
const server = createServer(app);

// Initialize Socket.IO with the HTTP server
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());

// Express Routes
app.get('/', (_req, res) => {
  res.send('Errgo Backend Interview Module Loaded Successfully!');
});

app.get('/projects', (_req, res) => {
  res.status(200).json(projects);
});

app.post('/projects', (req, res) => {
  try {
    const projectname = req.body.name;
    const projectdescription = req.body.description;
    const newproject: IProject = {
      id: uuid(),
      name: projectname,
      description: projectdescription
    };

    // Validate project data
    ProjectSchema.parse(newproject);

    projects.push(newproject);
    res.status(201).json({
      message: "Project is successfully added",
      project: newproject
    });
  } catch (e: any) {
    if (e instanceof ZodError) {
      return res.status(400).json({ errors: e.errors });
    }
    res.status(400).json(e.error);
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log("Client connected:", socket.id);

  socket.on('send', (message, callback) => {
    console.log("Received message:", message);
    io.emit('message', { message });
    if (callback) {
      callback({ status: 'Message received' });
    }
  });

  socket.on('disconnect', () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start the server using the HTTP server instance
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
}); 
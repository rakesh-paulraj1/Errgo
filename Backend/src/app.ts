import express from 'express';
import cors from 'cors';
import { IProject, ProjectSchema } from './models/project.interface';
import { v4 as uuid } from 'uuid';

const app = express();
const PORT = 3000;
// List of projects
const projects: IProject[] = [];

// Setup cors and express.json()
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Errgo Backend Interview Module Loaded Successfully!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

app.post('/projects', (req, res) => {
try{
 const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: "Missing name or description" });
    }
 const projectname=req.body.name;
 const projectdescription=description;
 const newproject:IProject={
  id:uuid(),
  name:projectname,
  description:projectdescription
 };

 if(!ProjectSchema.parse(newproject)){
  res.status(400).json({
    error:"The provided data is not correct"
  })

  projects.push(newproject);
  res.status(201).json({
    message:"Project is successfully added"
  })
  return;
 }}catch(e:any){
res.status(400).json(e.error);
return;
 }
});

app.get('/projects', (req, res) => {
  res.status(200).json(projects);
  return;
});
import express from 'express';
import cors from 'cors';
import { IProject, ProjectSchema } from './models/project.interface';
import { v4 as uuid } from 'uuid';
import { ZodError } from 'zod';
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
 
 const projectname=req.body.name;
 const projectdescription=req.body.description;
 const newproject:IProject={
  id:uuid(),
  name:projectname,
  description:projectdescription
 };

//  if(!ProjectSchema.parse(newproject)){
//   res.status(400).json({
//     error:"The provided data is not correct"
//   })}

  projects.push(newproject);
  res.status(201).json({
    message:"Project is successfully added"
  })
  return;
} catch(e:any){
   if (e instanceof ZodError) {
      return res.status(400).json({ errors: e.errors });
    }
  res.status(400).json(e.error);
  return;
}
});

app.get('/projects', (req, res) => {
  res.status(200).json(projects);
  return;
});
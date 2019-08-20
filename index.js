const express = require("express");
const server = express();

server.use(express.json());

let count = 0;

const projects = [];

server.use((req, res, next) => {
  count++;
  console.log(count);
  return next();
});

function checkProjectExists(req, res, next) {
  if (!projects[projects.findIndex(i => i.id == req.params.id)]) {
    return res.status(400).json({ error: "Project not exist." });
  }
  return next();
}

server.post("/projects", (req, res) => {
  let { id, title } = req.body;
  projects.push({ id, title, tasks: [] });
  res.status(201).send();
});

server.get("/projects", (req, res) => {
  res.json(projects);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  let { id } = req.params;
  let { title } = req.body;
  let index = projects.findIndex(i => i.id == id);
  projects[index].title = title;
  res.status(200).send();
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  let { id } = req.params;
  let index = projects.findIndex(i => i.id == id);
  projects.splice(index, 1);
  res.status(200).send();
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  let { title } = req.body;
  let { id } = req.params;
  let index = projects.findIndex(i => i.id == id);
  projects[index].tasks.push(title);
  res.status(201).send();
});

server.listen(3000);

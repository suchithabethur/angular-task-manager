const tasks = require("../data/tasks");

exports.getTasks = (req, res) => {
  res.json(tasks);
};

exports.addTask = (req, res) => {
  const newTask = {
    id: Date.now(),
    title: req.body.title
  };

  tasks.push(newTask);
  res.json(newTask);
};

exports.deleteTask = (req, res) => {
  const id = Number(req.params.id);

  const index = tasks.findIndex(task => task.id === id);

  if (index !== -1) {
    tasks.splice(index, 1);
  }

  res.json({ message: "Task deleted" });
};
exports.updateTask = (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find(t => t.id == id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  task.title = req.body.title;

  res.json(task);
};
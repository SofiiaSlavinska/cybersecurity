import { useState, useEffect } from 'react';
import Board from './Board';
import RecycleBin from './RecycleBin';
import StatsWidget from './StatsWidget';
import './App.css';

const INITIAL_TASKS = [
  { id: '1', title: 'Research Security', status: 'todo' },
  { id: '2', title: 'Build Base UI', status: 'todo' },
  { id: '3', title: 'Configure Vite', status: 'todo' },
];

function App() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [recycleBin, setRecycleBin] = useState([]);
  const [isBinLoading, setIsBinLoading] = useState(false);

  useEffect(() => {
    const doneCount = tasks.filter((t) => t.status === 'done').length;
    if (
      doneCount >= 2 &&
      !tasks.find((t) => t.title === 'Refactor Auth Logic')
    ) {
      const newTodo = {
        id: Math.random().toString(36).substr(2, 9),
        title: 'Refactor Auth Logic',
        status: 'todo',
      };
      setTasks((prev) => [...prev, newTodo]);
    }
  }, [tasks]);

  const handleMoveRight = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          if (task.status === 'todo') return { ...task, status: 'in-progress' };
          if (task.status === 'in-progress') return { ...task, status: 'done' };
        }
        return task;
      })
    );
  };

  const handleDelete = (taskId) => {
    if (isBinLoading) return;

    setIsBinLoading(true);
    setTimeout(() => setIsBinLoading(false), 1000);

    const taskToTrash = tasks.find((t) => t.id === taskId);
    if (taskToTrash) {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      setRecycleBin((prev) => [...prev, taskToTrash]);
    }
  };

  const handleRestore = () => {
    if (recycleBin.length === 0) return;
    const taskToRestore = recycleBin[0];
    setRecycleBin((prev) => prev.slice(1));
    setTasks((prev) => [...prev, taskToRestore]);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Project Board</h1>
        <p>Drag items right to progress, or drag down to delete.</p>
      </header>

      <main className="board-layout">
        <Board
          title="To Do"
          status="todo"
          tasks={tasks}
          onMoveRight={handleMoveRight}
          onDelete={handleDelete}
        />
        <Board
          title="In Progress"
          status="in-progress"
          tasks={tasks}
          onMoveRight={handleMoveRight}
          onDelete={handleDelete}
        />
        <Board
          title="Done"
          status="done"
          tasks={tasks}
          onMoveRight={handleMoveRight}
          onDelete={handleDelete}
        />
      </main>

      <footer className="board-footer">
        <RecycleBin
          count={recycleBin.length}
          onRestore={handleRestore}
          isLoading={isBinLoading}
        />
        <StatsWidget tasks={tasks} discardedCount={recycleBin.length} />
      </footer>
    </div>
  );
}

export default App;

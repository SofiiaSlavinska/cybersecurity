import TaskCard from './TaskCard';

function Board({ title, status, tasks, onMoveRight, onDelete }) {
  const columnTasks = tasks.filter((t) => t.status === status);

  return (
    <div className="column">
      <h3>
        {title} ({columnTasks.length})
      </h3>

      <div className="task-list">
        {columnTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onMoveRight={onMoveRight}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default Board;

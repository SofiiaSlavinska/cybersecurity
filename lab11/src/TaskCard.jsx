import { motion } from 'framer-motion';

function TaskCard({ task, onMoveRight, onDelete }) {
  const handleDragEnd = (event, info) => {
    if (info.offset.x > 150) {
      onMoveRight(task.id);
    } else if (info.offset.y > 150) {
      onDelete(task.id);
    }
  };

  return (
    <motion.div
      layout
      drag
      dragSnapToOrigin={true}
      onDragEnd={handleDragEnd}
      whileDrag={{
        scale: 1.05,
        zIndex: 999,
        boxShadow: '0px 10px 20px rgba(0,0,0,0.2)',
      }}
      style={{ position: 'relative' }}
      className="task-card"
    >
      <h4>{task.title}</h4>
      <p className="task-id">ID: {task.id}</p>
    </motion.div>
  );
}

export default TaskCard;

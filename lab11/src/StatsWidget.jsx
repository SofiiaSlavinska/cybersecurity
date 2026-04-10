function StatsWidget({ tasks, discardedCount }) {
  const todoCount = tasks.filter(t => t.status === 'todo').length;
  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
  const doneCount = tasks.filter(t => t.status === 'done').length;

  return (
    <div className="widget stats-widget">
      <h4>Board Statistics</h4>
      <div className="stats-grid">
        <div className="stat-item">
          <label>To Do:</label> <span>{todoCount}</span>
        </div>
        <div className="stat-item">
          <label>In Progress:</label> <span>{inProgressCount}</span>
        </div>
        <div className="stat-item">
          <label>Done:</label> <span>{doneCount}</span>
        </div>
        <div className="stat-item" style={{ borderLeft: '1px solid #ccc', paddingLeft: '10px' }}>
          <label>Discarded:</label> <span style={{ color: '#d93025' }}>{discardedCount}</span>
        </div>
      </div>
    </div>
  );
}

export default StatsWidget;
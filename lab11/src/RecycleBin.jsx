import { motion, useAnimation } from 'framer-motion';

function RecycleBin({ count, onRestore, isLoading }) {
  const controls = useAnimation();

  const startHold = async () => {
    if (count === 0 || isLoading) return;

    await controls.start({ width: "100%", transition: { duration: 1.5, ease: "linear" } });
    onRestore(); 
    controls.start({ width: "0%", transition: { duration: 0 } }); 
  };

  const cancelHold = () => {
    controls.start({ width: "0%", transition: { duration: 0.2 } });
  };

  return (
    <div className={`widget recycle-bin ${isLoading ? 'loading' : ''}`}>
      <div className="bin-icon">🗑️</div>
      <p>{isLoading ? 'Deleting...' : 'Drag items down to discard'}</p>
      
      <motion.button
        className="restore-btn"
        onPointerDown={startHold}
        onPointerUp={cancelHold}
        onPointerLeave={cancelHold}
        disabled={count === 0 || isLoading}
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        <span style={{ position: 'relative', zIndex: 2 }}>
          Hold to Restore ({count})
        </span>
        
        {}
        <motion.div 
          animate={controls}
          initial={{ width: "0%" }}
          style={{
            position: 'absolute',
            top: 0, left: 0, bottom: 0,
            background: '#4CAF50',
            zIndex: 1
          }}
        />
      </motion.button>
    </div>
  );
}

export default RecycleBin;
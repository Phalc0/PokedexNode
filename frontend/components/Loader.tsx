export default function Loader() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#1a0a0a', 
      gap: 16 
    }}>
      <div style={{ 
        width: 44, 
        height: 44, 
        borderRadius: '50%', 
        border: '3px solid rgba(157,228,244,0.2)', 
        borderTopColor: '#9de4f4', 
        animation: 'spin 0.8s linear infinite' 
      }} />
      <div style={{ 
        color: 'rgba(157,228,244,0.5)', 
        fontSize: 11, 
        fontFamily: 'monospace', 
        letterSpacing: '0.2em' 
      }}>
        CHARGEMENT...
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
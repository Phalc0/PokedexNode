export function NotFound({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#1a0a0a', gap:16 }}>
      <div style={{ fontSize:48 }}>❓</div>
      <div style={{ color:'rgba(157,228,244,0.7)', fontSize:13, fontFamily:'monospace', letterSpacing:'0.2em' }}>POKÉMON INTROUVABLE</div>
      <button onClick={onBack} style={{ padding:'8px 20px', background:'#c30d23', color:'#fff', border:'none', borderRadius:8, fontFamily:'monospace', cursor:'pointer', letterSpacing:'0.1em' }}>← RETOUR</button>
    </div>
  );
}
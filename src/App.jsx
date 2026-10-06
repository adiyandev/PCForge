import { useMemo, useState } from "react";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { games } from "./data/games";

function PlaceholderPage({title,description}){return <main className="page-shell"><section className="placeholder"><span className="eyebrow">PCForge</span><h1>{title}</h1><p>{description}</p></section></main>;}

const navItems=[{label:"Home",to:"/"},{label:"Games",to:"/games"},{label:"My PC",to:"/my-pc"},{label:"About",to:"/about"}];

function Games(){
 const [query,setQuery]=useState("");
 const navigate=useNavigate();
 const filtered=useMemo(()=>games.filter(game=>`${game.title} ${game.genre} ${game.platform}`.toLowerCase().includes(query.trim().toLowerCase())),[query]);
 return <main className="games-page page-shell">
  <section className="games-hero">
   <span className="eyebrow">Game library</span>
   <h1>Find out what<br/><span>you can run.</span></h1>
   <p>Search the PCForge game library and choose a title to check its requirements and compatibility.</p>
   <label className="game-search">
    <span aria-hidden="true">⌕</span>
    <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search games, genres, or platforms..." aria-label="Search games"/>
    {query && <button type="button" onClick={()=>setQuery("")} aria-label="Clear search">×</button>}
   </label>
  </section>
  <section className="games-results">
   <div className="results-heading"><div><span className="eyebrow">Library</span><h2>{filtered.length} {filtered.length===1?"game":"games"}</h2></div><span className="results-hint">Requirements will connect to the scanner later.</span></div>
   {filtered.length ? <div className="games-grid">{filtered.map(game=><article className="game-card" key={game.id} onClick={()=>navigate(`/games/${game.id}`)} role="button" tabIndex="0" onKeyDown={e=>{if(e.key==="Enter"||e.key===" ") navigate(`/games/${game.id}`)}}>
      <div className="game-art"><span>{game.title.slice(0,1)}</span><small>PCForge</small></div>
      <div className="game-card-body"><div className="game-meta"><span>{game.genre}</span><span>{game.platform}</span></div><h3>{game.title}</h3><p>{game.requirements}</p><span className="game-link">View requirements <b>→</b></span></div>
   </article>)}</div> : <div className="empty-games"><span>⌕</span><h3>No games found</h3><p>Try a different title, genre, or platform.</p><button className="button button-secondary" onClick={()=>setQuery("")}>Clear search</button></div>}
  </section>
 </main>;
}

function MyPC(){
 const [status,setStatus]=useState("idle");
 const [specs,setSpecs]=useState(null);
 const demo={cpu:"Not detected",gpu:"Not detected",ram:"Not detected",os:"Windows 11 64-bit",resolution:"Not detected",storage:"Not detected"};
 const scan=()=>{setStatus("scanning");setSpecs(null);setTimeout(()=>{setSpecs(demo);setStatus("ready")},1100)};
 return <main className="pc-page page-shell">
  <section className="pc-hero">
   <div><span className="eyebrow">Your hardware</span><h1>Know your<br/><span>PC.</span></h1><p>PCForge will use the scanner to identify the hardware that matters for gaming. Nothing is uploaded permanently.</p><button className="button button-primary" onClick={scan}>{status==="scanning"?"Scanning…":"Start PC scan"}</button></div>
   <div className={"pc-status-card "+status}><span className="status-dot"/><span>{status==="scanning"?"Scanner running":status==="ready"?"Scan complete":"Scanner ready"}</span><strong>{status==="scanning"?"Reading hardware…":status==="ready"?"Hardware profile ready":"Ready when you are"}</strong><small>{status==="ready"?"Demo profile — real .exe integration comes in Phase 2.":"This phase uses a local UI simulation; no scanner executable is connected yet."}</small></div>
  </section>
  <section className="hardware-section"><div className="section-heading"><span className="eyebrow">Hardware profile</span><h2>Your gaming<br/><span>specs.</span></h2></div>
   <div className="hardware-grid">
    {Object.entries(specs||demo).map(([key,value])=><article className={"hardware-card "+(!specs?"pending":"")} key={key}><small>{key.replace("ram","RAM").replace("cpu","CPU").replace("gpu","GPU").replace("os","OS").replace("resolution","Resolution").replace("storage","Free storage")}</small><strong>{value}</strong><span>{specs?"Detected":"Waiting for scan"}</span></article>)}
   </div>
  </section>
  <section className="scan-privacy"><span className="eyebrow">Privacy first</span><h2>Hardware only.<br/><span>Nothing personal.</span></h2><p>The future PCForge scanner is designed to read gaming-relevant system information only. It will not inspect documents, passwords, browser history, or personal files.</p></section>
 </main>;
}

function GameDetails({gameId}){
 const game=games.find(item=>item.id===gameId);
 if(!game) return <PlaceholderPage title="Game not found." description="That game is not in the PCForge library yet."/>;
 const requirements=game.requirementsData;
 const rows=[
  ["CPU",requirements.cpu,"Your PC","pending"],
  ["GPU",requirements.gpu,"Your PC","pending"],
  ["RAM",requirements.ram,"Your PC","pending"],
  ["Storage",requirements.storage,"Your PC","pending"]
 ];
 return <main className="details-page page-shell">
  <section className="details-hero">
   <div><span className="eyebrow">Compatibility check</span><h1>Can you run<br/><span>{game.title}?</span></h1><p>Compare your detected hardware with this game's requirements. Your final verdict will activate once PCForge has your scan.</p></div>
   <div className="verdict-card"><span className="verdict-icon">?</span><span className="eyebrow">Your verdict</span><strong>Waiting for PC scan</strong><p>Run the PCForge Scanner to compare your hardware.</p><NavLink className="button button-primary" to="/my-pc">View My PC</NavLink></div>
  </section>
  <section className="requirements-section">
   <div className="requirements-heading"><div><span className="eyebrow">System requirements</span><h2>What {game.title} needs.</h2></div><span className="requirement-note">{game.genre} · {game.platform}</span></div>
   <div className="requirement-table">
    <div className="req-row req-head"><span>Component</span><span>Minimum</span><span>Recommended</span><span>Your PC</span></div>
    {rows.map(([label,min,your,status])=><div className="req-row" key={label}><strong>{label}</strong><span>{min}</span><span>{requirements.recommended[label.toLowerCase()]||"Not specified"}</span><span className="req-pending">{status==="pending"?"Not scanned":your}</span></div>)}
   </div>
  </section>
  <section className="verdict-explainer"><div><span className="eyebrow">How PCForge scores</span><h2>Simple verdicts.<br/><span>No technical guessing.</span></h2></div><div className="verdict-list"><div><b>●</b><span><strong>Playable</strong><small>Your hardware meets the target.</small></span></div><div><b>●</b><span><strong>Barely</strong><small>You can play, but expect compromises.</small></span></div><div><b>●</b><span><strong>Not recommended</strong><small>Your hardware falls below the target.</small></span></div></div></section>
 </main>;
}

function Home(){
 return <main>
  <section className="hero page-shell">
   <div className="hero-copy">
    <span className="eyebrow">PC compatibility, simplified</span>
    <h1>Can your PC<br/><span>run it?</span></h1>
    <p className="hero-text">Stop guessing from system requirements. PCForge scans the hardware that matters and turns it into a simple answer.</p>
    <div className="hero-actions"><button className="button button-primary">Download Scanner</button><NavLink className="button button-secondary" to="/games">Check a Game</NavLink></div>
    <div className="trust-row"><span>● No account required</span><span>● No personal files scanned</span><span>● Temporary hardware data</span></div>
   </div>
   <div className="hero-panel" aria-label="PCForge scanner preview">
    <div className="panel-top"><span className="status-dot"/><span>PCForge Scanner</span><span className="panel-state">Ready to scan</span></div>
    <div className="scan-visual"><div className="scan-ring"><span>PC</span></div><div><strong>Know your PC.</strong><p>CPU, GPU, RAM and other gaming-relevant specs.</p></div></div>
    <div className="spec-preview"><div><small>CPU</small><strong>Waiting for scan</strong></div><div><small>GPU</small><strong>Waiting for scan</strong></div><div><small>RAM</small><strong>Waiting for scan</strong></div></div>
    <div className="scan-line"><span/></div>
    <p>Run the PCForge Scanner when you're ready.</p>
   </div>
  </section>

  <section className="section page-shell">
   <div className="section-heading"><span className="eyebrow">How it works</span><h2>Three steps.<br/><span>One clear answer.</span></h2></div>
   <div className="steps-grid">
    <article className="step-card"><span>01</span><div><h3>Scan your PC</h3><p>Download the lightweight PCForge Scanner and let it identify your gaming hardware.</p></div></article>
    <article className="step-card"><span>02</span><div><h3>Pick a game</h3><p>Search for the game you want to play and view its system requirements.</p></div></article>
    <article className="step-card"><span>03</span><div><h3>Get your verdict</h3><p>See whether your PC passes, struggles, or falls short — without the guesswork.</p></div></article>
   </div>
  </section>

  <section className="privacy-section page-shell">
   <div><span className="eyebrow">Designed with privacy in mind</span><h2>Your PC specs are enough.<br/><span>Your files aren't.</span></h2></div>
   <p>PCForge is designed around hardware information only. The scanner should never need your documents, passwords, browser history, or personal files to answer whether a game can run.</p>
  </section>

  <section className="cta-section page-shell">
   <div><span className="eyebrow">PCForge</span><h2>Ready to find out<br/>what you can play?</h2><button className="button button-primary">Download PCForge Scanner</button></div>
  </section>
 </main>;
}

function App(){
 return <div className="app">
  <header className="site-header">
   <NavLink className="brand" to="/"><span className="brand-mark">P</span><span>PCForge</span></NavLink>
   <nav className="nav-links" aria-label="Primary navigation">{navItems.map(item=><NavLink key={item.to} to={item.to} className={({isActive})=>"nav-link"+(isActive?" active":"")}>{item.label}</NavLink>)}</nav>
   <button className="header-cta">Download Scanner</button>
  </header>
  <Routes>
   <Route path="/" element={<Home/>}/>
   <Route path="/games" element={<Games/>}/>
   <Route path="/games/:gameId" element={<GameDetails gameId={window.location.pathname.split("/").pop()}/>}/>
   <Route path="/my-pc" element={<MyPC/>}/>
   <Route path="/about" element={<PlaceholderPage title="Built to make PC requirements simple." description="PCForge turns hardware requirements into an answer you can understand."/>}/>
  </Routes>
  <footer className="site-footer page-shell"><span>PCForge</span><span>Can Your PC Run It?</span></footer>
 </div>;
}
export default App;
import { useEffect, useMemo, useState } from "react";
import { NavLink, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { games } from "./data/games";

const isDesktop = import.meta.env.VITE_PCForge_DESKTOP === "true";

function PlaceholderPage({title,description}) {
  return <main className="page-shell"><section className="placeholder"><span className="eyebrow">PCForge</span><h1>{title}</h1><p>{description}</p></section></main>;
}

function About() {
 return <main className="about-page page-shell">
  <section className="about-hero"><span className="eyebrow">About PCForge</span><h1>PC requirements<br/><span>without the headache.</span></h1><p>PCForge turns confusing hardware requirements into a simple answer: can your PC run the game you want to play?</p><NavLink className="button button-primary" to="/my-pc">Check my PC</NavLink></section>
  <section className="about-grid">
   <article><span>01</span><h2>Hardware first.</h2><p>PCForge focuses on the components that actually affect whether a game can run: CPU, GPU, RAM, storage and system details.</p></article>
   <article><span>02</span><h2>Private by design.</h2><p>Your machine is not a permanent hardware profile. PCForge is designed around local compatibility checks.</p></article>
   <article><span>03</span><h2>Built for clarity.</h2><p>Instead of a wall of specifications, PCForge turns comparisons into straightforward verdicts you can understand.</p></article>
  </section>
 </main>;
}

const navItems=[{label:"Overview",to:"/"},{label:"Games",to:"/games"},{label:"My PC",to:"/my-pc"},{label:"Drivers",to:"/drivers"},{label:"Settings",to:"/settings"}];

function DesktopSidebar() {
 return <aside className="desktop-sidebar">
  <NavLink className="desktop-brand" to="/"><span className="brand-mark">P</span><span>PCForge</span></NavLink>
  <div className="sidebar-section">
   <span className="sidebar-label">WORKSPACE</span>
   <nav>{navItems.map(item=><NavLink key={item.to} to={item.to} end={item.to==="/"} className="sidebar-link"><span className="sidebar-icon">{item.label==="Overview"?"⌂":item.label==="Games"?"□":item.label==="My PC"?"▣":item.label==="Drivers"?"↻":"⚙"}</span><span>{item.label}</span></NavLink>)}</nav>
  </div>
  <div className="sidebar-bottom"><div className="desktop-status"><span className="status-dot online"/><span><strong>PCForge Desktop</strong><small>Ready</small></span></div><span className="sidebar-version">v0.2.0</span></div>
 </aside>;
}

function DesktopTopbar() {
 return <header className="desktop-topbar"><div><span className="eyebrow">PCForge Desktop</span><strong>PC compatibility, simplified.</strong></div><NavLink className="topbar-scan" to="/my-pc">Scan my PC <span>→</span></NavLink></header>;
}

function Games() {
 const [query,setQuery]=useState(""); const navigate=useNavigate();
 const filtered=useMemo(()=>games.filter(game=>`${game.title} ${game.genre} ${game.platform}`.toLowerCase().includes(query.trim().toLowerCase())),[query]);
 return <main className="games-page page-shell">
  <section className="games-hero"><div><span className="eyebrow">Game library</span><h1>Find a game<br/><span>to check.</span></h1><p>Browse the PCForge library and compare a game's requirements against your hardware.</p></div><label className="game-search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search games..." aria-label="Search games"/>{query&&<button onClick={()=>setQuery("")} aria-label="Clear search">×</button>}</label></section>
  <section className="games-results"><div className="results-heading"><div><span className="eyebrow">Library</span><h2>{filtered.length} {filtered.length===1?"game":"games"}</h2></div><span className="results-hint">More titles will be added from the live catalog.</span></div>
   {filtered.length?<div className="games-grid">{filtered.map(game=><article className="game-card" key={game.id} onClick={()=>navigate(`/games/${game.id}`)} tabIndex="0" role="button" onKeyDown={e=>(e.key==="Enter"||e.key===" ")&&navigate(`/games/${game.id}`)}><div className="game-art"><span>{game.title.slice(0,1)}</span><small>PCForge</small></div><div className="game-card-body"><div className="game-meta"><span>{game.genre}</span><span>{game.platform}</span></div><h3>{game.title}</h3><p>{game.requirements}</p><span className="game-link">View requirements <b>→</b></span></div></article>)}</div>:<div className="empty-games"><span>⌕</span><h3>No games found</h3><p>Try a different title, genre, or platform.</p><button className="button button-secondary" onClick={()=>setQuery("")}>Clear search</button></div>}
  </section>
 </main>;
}

function MyPC() {
 const [status,setStatus]=useState("idle"); const [specs,setSpecs]=useState(null);
 useEffect(()=>{const params=new URLSearchParams(window.location.search);const raw=params.get("scan");if(!raw)return;try{const data=JSON.parse(raw);const detected={cpu:data.cpu||"Not detected",gpu:data.gpu||"Not detected",ram:data.ram?data.ram+" GB":"Not detected",os:data.os||"Not detected",resolution:data.resolution||"Not detected",storage:data.storage_free_gb!=null?data.storage_free_gb+" GB free":"Not detected"};setSpecs(detected);setStatus("ready");localStorage.setItem("pcforge_scan",JSON.stringify(data));window.history.replaceState({},document.title,window.location.pathname)}catch{setStatus("idle")}},[]);
 const values=specs||{cpu:"Not detected",gpu:"Not detected",ram:"Not detected",os:"Not detected",resolution:"Not detected",storage:"Not detected"};
 return <main className="pc-page page-shell">
  <section className="pc-hero"><div><span className="eyebrow">Your hardware</span><h1>Know your<br/><span>PC.</span></h1><p>PCForge will inspect gaming-relevant hardware locally and use it for compatibility checks.</p>{isDesktop?<button className="button button-primary" onClick={()=>setStatus("scanning")}>Scan my PC</button>:<a className="button button-primary" href="https://github.com/adiyandev/PCForge/releases/latest">Download PCForge Scanner</a>}</div>
   <div className={"pc-status-card "+status}><span className={"status-dot "+(status==="ready"?"online":"")}/><span>{status==="ready"?"Scanner complete":status==="scanning"?"Scanning system":"Scanner ready"}</span><strong>{status==="ready"?"Hardware profile ready":status==="scanning"?"Preparing hardware scan":"Ready when you are"}</strong><small>{status==="ready"?"Detected locally by PCForge.":status==="scanning"?"Hardware detection will connect here in Phase 4.":"No hardware data has been collected yet."}</small></div>
  </section>
  <section className="hardware-section"><div className="section-heading"><span className="eyebrow">Hardware profile</span><h2>Your gaming<br/><span>specs.</span></h2></div><div className="hardware-grid">{Object.entries(values).map(([key,value])=><article className={"hardware-card "+(!specs?"pending":"")} key={key}><small>{key.replace("ram","RAM").replace("cpu","CPU").replace("gpu","GPU").replace("os","OS").replace("resolution","Resolution").replace("storage","Free storage")}</small><strong>{value}</strong><span>{specs?"Detected":"Waiting for scan"}</span></article>)}</div></section>
  <section className="scan-privacy"><div><span className="eyebrow">Privacy</span><h2>Hardware only.<br/><span>Nothing personal.</span></h2></div><p>The desktop scanner is designed to read gaming-relevant system information only. It does not need documents, passwords, browser history, or personal files.</p></section>
 </main>;
}

function GameDetails() {
 const {gameId}=useParams(); const game=games.find(item=>item.id===gameId); if(!game)return <PlaceholderPage title="Game not found." description="That game is not in the PCForge library yet."/>; const r=game.requirementsData;
 const rows=[["CPU",r.cpu,r.recommended.cpu],["GPU",r.gpu,r.recommended.gpu],["RAM",r.ram,r.recommended.ram],["Storage",r.storage,r.recommended.storage]];
 return <main className="details-page page-shell"><section className="details-hero"><div><span className="eyebrow">Compatibility check</span><h1>Can you run<br/><span>{game.title}?</span></h1><p>Compare this game's requirements with your detected PC hardware.</p></div><div className="verdict-card"><span className="verdict-icon">?</span><span className="eyebrow">Your verdict</span><strong>Waiting for PC scan</strong><p>Run a local scan to compare your hardware.</p><NavLink className="button button-primary" to="/my-pc">View My PC</NavLink></div></section><section className="requirements-section"><div className="requirements-heading"><div><span className="eyebrow">System requirements</span><h2>What {game.title} needs.</h2></div><span className="requirement-note">{game.genre} · {game.platform}</span></div><div className="requirement-table"><div className="req-row req-head"><span>Component</span><span>Minimum</span><span>Recommended</span></div>{rows.map(([label,min,max])=><div className="req-row" key={label}><strong>{label}</strong><span>{min}</span><span>{max||"Not specified"}</span></div>)}</div></section></main>;
}

function Dashboard() {
 return <main className="dashboard page-shell"><section className="dashboard-hero"><div><span className="eyebrow">Overview</span><h1>Everything you need<br/><span>to check your PC.</span></h1><p>Scan your hardware, browse games, and get a clear compatibility verdict.</p><div className="dashboard-actions"><NavLink className="button button-primary" to="/my-pc">Scan my PC</NavLink><NavLink className="button button-secondary" to="/games">Browse games</NavLink></div></div><div className="dashboard-card"><div className="card-heading"><span>System status</span><span className="status-badge"><i/> Ready</span></div><div className="dashboard-stat"><strong>Not scanned</strong><span>Run your first PCForge scan</span></div><div className="dashboard-divider"/><div className="dashboard-mini"><span>Hardware detection</span><b>Ready</b></div><div className="dashboard-mini"><span>Game library</span><b>{games.length} titles</b></div></div></section><section className="dashboard-grid"><article><span className="eyebrow">My PC</span><h2>See what your machine is made of.</h2><p>CPU, GPU, memory, storage, Windows and display information in one place.</p><NavLink to="/my-pc">Open My PC →</NavLink></article><article><span className="eyebrow">Games</span><h2>Check before you install.</h2><p>Open a game and see its minimum and recommended requirements.</p><NavLink to="/games">Browse library →</NavLink></article></section></main>;
}

function SimplePage({title,description}){return <main className="page-shell simple-page"><span className="eyebrow">PCForge</span><h1>{title}</h1><p>{description}</p><div className="coming-card"><span>Planned for a later phase</span><strong>This area is reserved for the full desktop experience.</strong></div></main>}

function App() {
 const content=<Routes><Route path="/" element={isDesktop?<Dashboard/>:<Home/>}/><Route path="/games" element={<Games/>}/><Route path="/games/:gameId" element={<GameDetails/>}/><Route path="/my-pc" element={<MyPC/>}/><Route path="/about" element={<About/>}/><Route path="/drivers" element={<SimplePage title="Drivers" description="A clean view of installed drivers and trustworthy update status will live here."/>}/><Route path="/settings" element={<SimplePage title="Settings" description="Desktop preferences, privacy controls, scan behavior and updates will live here."/>}/></Routes>;
 if(!isDesktop)return <div className="app"><header className="site-header"><NavLink className="brand" to="/"><span className="brand-mark">P</span><span>PCForge</span></NavLink><nav className="nav-links">{[{label:"Home",to:"/"},{label:"Games",to:"/games"},{label:"My PC",to:"/my-pc"},{label:"About",to:"/about"}].map(item=><NavLink key={item.to} to={item.to} className="nav-link">{item.label}</NavLink>)}</nav><NavLink className="header-cta" to="/my-pc">Open Scanner</NavLink></header>{content}<footer className="site-footer page-shell"><span>PCForge</span><span>Can Your PC Run It?</span></footer></div>;
 return <div className="desktop-app"><DesktopSidebar/><div className="desktop-main"><DesktopTopbar/>{content}</div></div>;
}
export default App;

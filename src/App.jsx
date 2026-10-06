import { NavLink, Route, Routes } from "react-router-dom";

const navItems=[{label:"Home",to:"/"},{label:"Games",to:"/games"},{label:"My PC",to:"/my-pc"},{label:"About",to:"/about"}];

function PlaceholderPage({title,description}){return <main className="page-shell"><section className="placeholder"><span className="eyebrow">PCForge</span><h1>{title}</h1><p>{description}</p></section></main>;}

function Home(){
 return <main className="page-shell">
  <section className="hero">
   <div className="hero-copy">
    <span className="eyebrow">PC compatibility, simplified</span>
    <h1>Can your PC<br/><span>run it?</span></h1>
    <p className="hero-text">Scan your hardware once, then see which games your PC can actually handle.</p>
    <div className="hero-actions"><button className="button button-primary">Scan My PC</button><NavLink className="button button-secondary" to="/games">Check a Game</NavLink></div>
    <div className="trust-row"><span>● No account required</span><span>● Hardware-focused</span><span>● Built for gamers</span></div>
   </div>
   <div className="hero-panel" aria-label="PCForge scan preview">
    <div className="panel-top"><span className="status-dot"/><span>PCForge Scanner</span><span className="panel-state">Ready</span></div>
    <div className="spec-preview"><div><small>CPU</small><strong>Not scanned yet</strong></div><div><small>GPU</small><strong>Not scanned yet</strong></div><div><small>RAM</small><strong>— GB</strong></div></div>
    <div className="scan-line"><span/></div><p>Run the PCForge Scanner to detect your hardware.</p>
   </div>
  </section>
  <section className="feature-grid" aria-label="PCForge features">
   <article className="feature-card"><span className="feature-number">01</span><h2>Scan</h2><p>Let PCForge identify the hardware that matters for gaming.</p></article>
   <article className="feature-card"><span className="feature-number">02</span><h2>Search</h2><p>Find a game and compare its requirements with your system.</p></article>
   <article className="feature-card"><span className="feature-number">03</span><h2>Know</h2><p>Get a clear verdict instead of trying to decode hardware specs.</p></article>
  </section>
 </main>;
}

function App(){
 return <div className="app">
  <header className="site-header">
   <NavLink className="brand" to="/"><span className="brand-mark">P</span><span>PCForge</span></NavLink>
   <nav className="nav-links" aria-label="Primary navigation">{navItems.map(item=><NavLink key={item.to} to={item.to} className={({isActive})=>"nav-link"+(isActive?" active":"")}>{item.label}</NavLink>)}</nav>
   <button className="header-cta">Scan My PC</button>
  </header>
  <Routes>
   <Route path="/" element={<Home/>}/>
   <Route path="/games" element={<PlaceholderPage title="Find your next game." description="The game search experience is coming in Phase 1C."/>}/>
   <Route path="/my-pc" element={<PlaceholderPage title="Your PC, at a glance." description="The detected hardware dashboard is coming in Phase 1E."/>}/>
   <Route path="/about" element={<PlaceholderPage title="Built to make PC requirements simple." description="PCForge turns hardware requirements into an answer you can understand."/>}/>
  </Routes>
 </div>;
}
export default App;
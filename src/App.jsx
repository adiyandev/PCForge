import { NavLink, Route, Routes } from "react-router-dom";

const navItems=[{label:"Home",to:"/"},{label:"Games",to:"/games"},{label:"My PC",to:"/my-pc"},{label:"About",to:"/about"}];

function PlaceholderPage({title,description}){return <main className="page-shell"><section className="placeholder"><span className="eyebrow">PCForge</span><h1>{title}</h1><p>{description}</p></section></main>;}

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
   <Route path="/games" element={<PlaceholderPage title="Find your next game." description="The game search experience is coming in Phase 1C."/>}/>
   <Route path="/my-pc" element={<PlaceholderPage title="Your PC, at a glance." description="The detected hardware dashboard is coming in Phase 1E."/>}/>
   <Route path="/about" element={<PlaceholderPage title="Built to make PC requirements simple." description="PCForge turns hardware requirements into an answer you can understand."/>}/>
  </Routes>
  <footer className="site-footer page-shell"><span>PCForge</span><span>Can Your PC Run It?</span></footer>
 </div>;
}
export default App;
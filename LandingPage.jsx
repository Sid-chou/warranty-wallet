import { useEffect, useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --orange: #E84520;
    --dark:   #111111;
    --mid:    #6B6B6B;
    --soft:   #F7F6F3;
    --line:   #E8E8E8;
    --white:  #ffffff;
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--white); color: var(--dark); overflow-x: hidden; -webkit-font-smoothing: antialiased; }

  .ww-nav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(255,255,255,0.94);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--line);
    padding: 0 6%; height: 64px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .ww-logo { display: flex; align-items: center; gap: 8px; text-decoration: none; }
  .ww-logo-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--orange); }
  .ww-logo-text { font-size: 15px; font-weight: 600; color: var(--dark); letter-spacing: -0.01em; }
  .ww-nav-links { display: flex; gap: 36px; list-style: none; }
  .ww-nav-links a { font-size: 14px; color: var(--mid); text-decoration: none; transition: color 0.15s; }
  .ww-nav-links a:hover { color: var(--dark); }
  .ww-nav-right { display: flex; align-items: center; gap: 20px; }
  .ww-nav-login { font-size: 14px; color: var(--mid); text-decoration: none; }

  .ww-btn {
    background: var(--orange); color: white; border: none; border-radius: 6px;
    padding: 10px 22px; font-family: 'DM Sans', sans-serif; font-size: 14px;
    font-weight: 600; cursor: pointer; text-decoration: none; display: inline-block;
    transition: opacity 0.15s, transform 0.15s;
  }
  .ww-btn:hover { opacity: 0.86; transform: translateY(-1px); }
  .ww-btn-ghost {
    background: transparent; color: var(--dark); border: 1px solid var(--line);
    border-radius: 6px; padding: 10px 22px; font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 500; cursor: pointer; text-decoration: none;
    display: inline-block; transition: border-color 0.15s;
  }
  .ww-btn-ghost:hover { border-color: #999; }

  /* ── HERO ── */
  .ww-hero {
    padding: 120px 6% 100px;
    text-align: center;
    display: flex; flex-direction: column; align-items: center;
  }
  .ww-hero-label {
    font-size: 12px; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--orange);
    margin-bottom: 28px;
    display: flex; align-items: center; gap: 10px;
  }
  .ww-hero-label::before, .ww-hero-label::after {
    content: ''; display: block; width: 28px; height: 1px; background: var(--orange); opacity: 0.5;
  }
  .ww-hero-h1 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(80px, 12vw, 160px);
    line-height: 0.9;
    letter-spacing: 0.01em;
    color: var(--dark);
    margin-bottom: 32px;
  }
  .ww-hero-h1 em { font-style: normal; color: var(--orange); }
  .ww-hero-sub {
    font-size: 18px; color: var(--mid); line-height: 1.65;
    font-weight: 300; max-width: 480px; margin-bottom: 48px;
  }
  .ww-hero-ctas { display: flex; align-items: center; gap: 14px; }

  /* ── TICKER ── */
  .ww-ticker {
    background: var(--dark); color: white;
    padding: 14px 0; overflow: hidden; white-space: nowrap;
  }
  .ww-ticker-inner {
    display: inline-flex; gap: 48px;
    animation: ticker 22s linear infinite;
  }
  .ww-ticker-item {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 15px; letter-spacing: 0.12em;
    display: flex; align-items: center; gap: 48px;
  }
  .ww-ticker-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--orange); flex-shrink: 0; }
  @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  /* ── PROBLEM ── */
  .ww-problem {
    padding: 120px 6%;
    display: grid; grid-template-columns: 1fr 1fr; gap: 100px; align-items: center;
  }
  .ww-problem-left { }
  .ww-problem-big {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(56px, 5vw, 80px);
    line-height: 1.0; color: var(--dark); margin-bottom: 24px;
  }
  .ww-problem-big em { font-style: normal; color: var(--orange); }
  .ww-problem-body {
    font-size: 16px; color: var(--mid); line-height: 1.7; font-weight: 300;
  }
  .ww-problem-right {
    border-left: 1px solid var(--line); padding-left: 60px;
    display: flex; flex-direction: column; gap: 40px;
  }
  .ww-stat-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 72px; line-height: 1; color: var(--dark); margin-bottom: 6px;
  }
  .ww-stat-num span { color: var(--orange); }
  .ww-stat-label { font-size: 14px; color: var(--mid); font-weight: 300; max-width: 200px; line-height: 1.5; }
  .ww-stat-divider { height: 1px; background: var(--line); }

  /* ── FEATURES ── */
  .ww-features { background: var(--soft); padding: 100px 6%; }
  .ww-features-top {
    display: flex; justify-content: space-between; align-items: flex-end;
    margin-bottom: 60px; padding-bottom: 40px; border-bottom: 1px solid var(--line);
  }
  .ww-features-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(48px, 5vw, 72px); color: var(--dark); line-height: 0.95;
  }
  .ww-features-sub { font-size: 14px; color: var(--mid); font-weight: 300; max-width: 220px; text-align: right; line-height: 1.6; }
  .ww-features-grid {
    display: grid; grid-template-columns: repeat(3,1fr);
    border: 1px solid var(--line); border-radius: 12px; overflow: hidden; gap: 0;
  }
  .ww-feature {
    background: var(--white); padding: 44px 36px;
    border-right: 1px solid var(--line);
    transition: background 0.2s;
  }
  .ww-feature:last-child { border-right: none; }
  .ww-feature:hover { background: #FEFAF9; }
  .ww-feat-n {
    font-size: 11px; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--orange); margin-bottom: 28px;
  }
  .ww-feat-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 30px; color: var(--dark); margin-bottom: 14px; line-height: 1.0;
  }
  .ww-feat-body { font-size: 14px; color: var(--mid); line-height: 1.65; font-weight: 300; }

  /* ── HOW ── */
  .ww-how { padding: 100px 6%; text-align: center; }
  .ww-how-label {
    font-size: 12px; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--orange); margin-bottom: 20px;
  }
  .ww-how-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(52px, 6vw, 88px); color: var(--dark);
    line-height: 0.93; margin-bottom: 80px;
  }
  .ww-steps {
    display: grid; grid-template-columns: repeat(3,1fr);
    gap: 0; text-align: left; position: relative;
  }
  .ww-step {
    padding: 0 48px 0 0; position: relative;
  }
  .ww-step:not(:last-child)::after {
    content: '→';
    position: absolute; right: 10px; top: 12px;
    font-size: 18px; color: var(--line);
  }
  .ww-step:last-child { padding-right: 0; }
  .ww-step:nth-child(2), .ww-step:nth-child(3) { padding-left: 48px; }
  .ww-step-n {
    display: inline-flex; align-items: center; justify-content: center;
    width: 36px; height: 36px; border-radius: 50%;
    background: var(--orange); color: white;
    font-size: 14px; font-weight: 700; margin-bottom: 24px;
  }
  .ww-step-title { font-size: 18px; font-weight: 600; color: var(--dark); margin-bottom: 12px; letter-spacing: -0.01em; }
  .ww-step-body { font-size: 14px; color: var(--mid); line-height: 1.65; font-weight: 300; }

  /* ── CTA FINAL ── */
  .ww-cta {
    background: var(--dark); padding: 140px 6%;
    text-align: center; display: flex; flex-direction: column; align-items: center;
  }
  .ww-cta-h {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(72px, 10vw, 140px);
    line-height: 0.9; color: white; margin-bottom: 32px;
  }
  .ww-cta-h em { font-style: normal; color: var(--orange); }
  .ww-cta-sub {
    font-size: 16px; color: rgba(255,255,255,0.4);
    font-weight: 300; margin-bottom: 44px; max-width: 380px; line-height: 1.6;
  }
  .ww-cta-note { font-size: 12px; color: rgba(255,255,255,0.25); margin-top: 16px; }

  /* ── FOOTER ── */
  .ww-footer {
    border-top: 1px solid var(--line); padding: 28px 6%;
    display: flex; align-items: center; justify-content: space-between;
  }
  .ww-footer-links { display: flex; gap: 28px; list-style: none; }
  .ww-footer-links a { font-size: 13px; color: var(--mid); text-decoration: none; }
  .ww-footer-copy { font-size: 13px; color: #ccc; }

  /* ── RESPONSIVE ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .ww-animate { animation: fadeUp 0.7s ease both; }
  .ww-animate-2 { animation: fadeUp 0.7s 0.12s ease both; }
  .ww-animate-3 { animation: fadeUp 0.7s 0.24s ease both; }
  .ww-animate-4 { animation: fadeUp 0.7s 0.36s ease both; }

  @media (max-width: 860px) {
    .ww-nav-links { display: none; }
    .ww-problem { grid-template-columns: 1fr; gap: 48px; }
    .ww-problem-right { border-left: none; padding-left: 0; border-top: 1px solid var(--line); padding-top: 40px; }
    .ww-features-grid, .ww-steps { grid-template-columns: 1fr; }
    .ww-feature { border-right: none; border-bottom: 1px solid var(--line); }
    .ww-step, .ww-step:nth-child(2), .ww-step:nth-child(3) { padding: 36px 0; border-bottom: 1px solid var(--line); }
    .ww-step::after { display: none; }
    .ww-features-top { flex-direction: column; align-items: flex-start; gap: 12px; }
    .ww-features-sub { text-align: left; }
  }
`;

const tickerItems = [
  "Never lose a warranty again",
  "Upload any bill in seconds",
  "AI reads every field for you",
  "Expiry alerts before it's too late",
  "Every product. Every warranty.",
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{styles}</style>

      {/* NAV */}
      <nav className="ww-nav">
        <a href="#" className="ww-logo">
          <div className="ww-logo-dot" />
          <span className="ww-logo-text">Warranty Wallet</span>
        </a>
        <ul className="ww-nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#how">How It Works</a></li>
          <li><a href="#">FAQ</a></li>
        </ul>
        <div className="ww-nav-right">
          <a href="/login" className="ww-nav-login">Login</a>
          <a href="/signup" className="ww-btn">Get Started</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="ww-hero">
        <p className="ww-hero-label ww-animate">Warranty Management</p>
        <h1 className="ww-hero-h1 ww-animate-2">
          TOO MANY BILLS.<br />
          <em>NO SYSTEM.</em>
        </h1>
        <p className="ww-hero-sub ww-animate-3">
          Most people have dozens of products with active warranties and no idea
          where the bills are. Warranty Wallet fixes that — one upload, tracked forever.
        </p>
        <div className="ww-hero-ctas ww-animate-4">
          <a href="#how" className="ww-btn" style={{ padding: "13px 32px", fontSize: "15px" }}>
            See How It Works
          </a>
          <a href="/signup" className="ww-btn-ghost" style={{ padding: "13px 32px", fontSize: "15px" }}>
            Sign up free
          </a>
        </div>
      </section>

      {/* TICKER */}
      <div className="ww-ticker">
        <div className="ww-ticker-inner">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span className="ww-ticker-item" key={i}>
              {item}
              <span className="ww-ticker-dot" />
            </span>
          ))}
        </div>
      </div>

      {/* PROBLEM */}
      <section className="ww-problem">
        <div className="ww-problem-left">
          <h2 className="ww-problem-big">
            THE BILL IS GONE.<br />
            THE WARRANTY<br />
            <em>STILL ISN'T.</em>
          </h2>
          <p className="ww-problem-body">
            When something breaks, the clock starts ticking. You need the receipt,
            the warranty card, the purchase date — and most people can't find any of it.
            That's not a memory problem. That's a systems problem.
          </p>
        </div>
        <div className="ww-problem-right">
          <div>
            <div className="ww-stat-num">15<span>+</span></div>
            <div className="ww-stat-label">Active warranties in an average household — most of them untracked.</div>
          </div>
          <div className="ww-stat-divider" />
          <div>
            <div className="ww-stat-num"><span>₹</span>0</div>
            <div className="ww-stat-label">Claimed on most expired warranties because nobody knew in time.</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="ww-features" id="features">
        <div className="ww-features-top">
          <h2 className="ww-features-title">WHAT CHANGES<br />WHEN YOU USE IT</h2>
          <p className="ww-features-sub">Three things — nothing more, nothing less.</p>
        </div>
        <div className="ww-features-grid">
          <div className="ww-feature">
            <p className="ww-feat-n">01 — Upload</p>
            <h3 className="ww-feat-title">Any Bill. Any Format.</h3>
            <p className="ww-feat-body">
              Photo, PDF, screenshot — it doesn't matter. AI reads the product,
              date, merchant, warranty period, and serial number. No manual entry. Ever.
            </p>
          </div>
          <div className="ww-feature">
            <p className="ww-feat-n">02 — Alerts</p>
            <h3 className="ww-feat-title">Know Before It's Too Late.</h3>
            <p className="ww-feat-body">
              Get notified 30 days before any warranty expires. Not the day after.
              Every claim window stays open until you decide to close it.
            </p>
          </div>
          <div className="ww-feature">
            <p className="ww-feat-n">03 — Find</p>
            <h3 className="ww-feat-title">Anything. In Seconds.</h3>
            <p className="ww-feat-body">
              Every bill organised by category — electronics, appliances, vehicles.
              Search by product or merchant. Find it before you need a service centre.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="ww-how" id="how">
        <p className="ww-how-label">How It Works</p>
        <h2 className="ww-how-title">THREE STEPS.<br />DONE.</h2>
        <div className="ww-steps">
          <div className="ww-step">
            <div className="ww-step-n">1</div>
            <h3 className="ww-step-title">Upload your bill</h3>
            <p className="ww-step-body">
              Take a photo of any receipt or warranty card. Any format, any quality. Just upload it.
            </p>
          </div>
          <div className="ww-step">
            <div className="ww-step-n">2</div>
            <h3 className="ww-step-title">AI reads everything</h3>
            <p className="ww-step-body">
              Gemini reads the bill and pulls out every relevant field —
              product, date, warranty period, price — in seconds.
            </p>
          </div>
          <div className="ww-step">
            <div className="ww-step-n">3</div>
            <h3 className="ww-step-title">We handle the rest</h3>
            <p className="ww-step-body">
              Your warranty is tracked, categorised, and monitored.
              You'll hear from us before it expires — and only then.
            </p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="ww-cta">
        <h2 className="ww-cta-h">
          STOP LOSING<br />MONEY ON<br /><em>LOST BILLS.</em>
        </h2>
        <p className="ww-cta-sub">
          It takes two minutes to get started. Your first warranty upload is free.
        </p>
        <a href="/signup" className="ww-btn" style={{ padding: "15px 40px", fontSize: "16px" }}>
          Get Started Free
        </a>
        <p className="ww-cta-note">No credit card required</p>
      </section>

      {/* FOOTER */}
      <footer className="ww-footer">
        <a href="#" className="ww-logo">
          <div className="ww-logo-dot" />
          <span className="ww-logo-text">Warranty Wallet</span>
        </a>
        <ul className="ww-footer-links">
          <li><a href="#">Privacy</a></li>
          <li><a href="#">Terms</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
        <span className="ww-footer-copy">© 2025 Warranty Wallet</span>
      </footer>
    </>
  );
}

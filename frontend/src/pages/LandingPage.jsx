import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo1.png";
import "./LandingPage.css";

const tickerItems = [
  "Never lose a warranty again",
  "Upload any bill in seconds",
  "AI reads every field for you",
  "Expiry alerts before it's too late",
  "Every product. Every warranty.",
];

const featuresData = [
  {
    step: "01 — Upload",
    title: "Any Bill. Any Format.",
    body: "Photo, PDF, screenshot — it doesn't matter. AI reads the product, date, merchant, warranty period, and serial number. No manual entry. Ever."
  },
  {
    step: "02 — Alerts",
    title: "Know Before It's Too Late.",
    body: "Get notified 30 days before any warranty expires. Not the day after. Every claim window stays open until you decide to close it."
  },
  {
    step: "03 — Find",
    title: "Anything. In Seconds.",
    body: "Every bill organised by category — electronics, appliances, vehicles. Search by product or merchant. Find it before you need a service centre."
  }
];

const stepsData = [
  {
    n: 1,
    title: "Upload your bill",
    body: "Take a photo of any receipt or warranty card. Any format, any quality. Just upload it.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80"
  },
  {
    n: 2,
    title: "AI reads everything",
    body: "Gemini reads the bill and pulls out every relevant field — product, date, warranty period, price — in seconds.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
  },
  {
    n: 3,
    title: "We handle the rest",
    body: "Your warranty is tracked, categorised, and monitored. You'll hear from us before it expires.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
  }
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  // Handle auto-switching logic
  useEffect(() => {
    const duration = 6000; // 6 seconds per step
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = (elapsed / duration) * 100;

      if (calculatedProgress >= 100) {
        setProgress(100);
        setActiveStep((current) => (current + 1) % stepsData.length);
      } else {
        setProgress(calculatedProgress);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [activeStep]); // Re-runs and resets timer when step changes

  const handleStepClick = (index) => {
    setActiveStep(index);
    setProgress(0); 
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="ww-page-container">
      {/* NAV */}
      <nav className={`ww-nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="ww-nav-container">
          <Link to="/" className="ww-logo">
            <img src={logo} alt="Warranty Wallet" className="ww-logo-img" />
            <a className="ww-logo-text">Warranty Wallet</a>
          </Link>
          <ul className="ww-nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#how">How It Works</a></li>
            {/* <li><a href="#faq">FAQ</a></li> */}
          </ul>
          <div className="ww-nav-right">
            <Link to="/login" className="ww-nav-login">Login</Link>
            <Link to="/signup" className="ww-btn">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="ww-hero">
        <div className="ww-container">
          {/* <p className="ww-hero-label ww-animate">Warranty Management</p> */}
          <h1 className="ww-hero-h1 ww-animate-2">
            Your Warranties on <br />
            <em>Autopilot</em>
          </h1>
          <p className="ww-hero-sub ww-animate-3">
            Ditch the paper clutter. Securely store your bills and get notified before your purchase protections expire.
          </p>
          <div className="ww-hero-ctas ww-animate-4">
            <a href="#how" className="ww-btn ww-btn-lg">
              See How It Works
            </a>
            <Link to="/signup" className="ww-btn-ghost ww-btn-lg">
              Sign up free
            </Link>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ww-ticker">
        <div className="ww-ticker-inner">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span className="ww-ticker-item" key={`ticker-${i}`}>
              {item}
              <span className="ww-ticker-dot" />
            </span>
          ))}
        </div>
      </div>

      {/* PROBLEM */}
      <section className="ww-problem">
        <div className="ww-container ww-problem-grid">
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
        </div>
      </section>

      {/* FEATURES */}
      <section className="ww-features" id="features">
        <div className="ww-container">
          <div className="ww-features-top">
            <h2 className="ww-features-title">WHAT CHANGES<br />WHEN YOU USE IT</h2>
            {/* <p className="ww-features-sub">Three things — nothing more, nothing less.</p> */}
          </div>
          <div className="ww-features-grid">
            {featuresData.map((feature, featureIndex) => (
              <div className="ww-feature" key={`feature-${featureIndex}`}>
                <p className="ww-feat-n">{feature.step}</p>
                <h3 className="ww-feat-title">{feature.title}</h3>
                <p className="ww-feat-body">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="ww-how" id="how">
        <div className="ww-container">
          <p className="ww-how-label">How It Works</p>
          <h2 className="ww-how-title">THREE STEPS.<br />DONE.</h2>
          <div className="ww-steps">
            {stepsData.map((stepItem, index) => (
              <div 
                className={`ww-step ${activeStep === index ? 'ww-step-active' : ''}`} 
                key={`step-${stepItem.n}`}
                onClick={() => handleStepClick(index)}
                style={{ cursor: 'pointer' }}
              >
                <div className="ww-step-header">
                  <div className="ww-step-n">{stepItem.n}.</div>
                  <h3 className="ww-step-title">{stepItem.title}</h3>
                </div>
                <p className="ww-step-body">{stepItem.body}</p>
                
                {/* The Progress Bar Container */}
                <div className="ww-step-progress-bg">
                  <div 
                    className="ww-step-progress-fill" 
                    style={{ width: activeStep === index ? `${progress}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Dynamic Visual Display Area */}
          <div className="ww-how-display">
            <div className="ww-display-inner">
              {stepsData.map((step, index) => (
                <img 
                  key={index}
                  src={step.image} 
                  alt={step.title}
                  className={`ww-display-img ${activeStep === index ? 'active' : ''}`}
                />
              ))}
            </div>
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
        <Link to="/signup" className="ww-btn ww-btn-xl">
          Get Started Free
        </Link>
        <p className="ww-cta-note">No credit card required</p>
      </section>

      {/* FOOTER */}
      <footer className="ww-footer">
        <div className="ww-nav-container">
          <Link to="/" className="ww-logo">
            <img src={logo} alt="Warranty Wallet" className="ww-logo-footer" />
            <span className="ww-logo-text">Warranty Wallet</span>
          </Link>
          <ul className="ww-footer-links">
            <li><a href="#privacy">Privacy</a></li>
            <li><a href="#terms">Terms</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <span className="ww-footer-copy">© {new Date().getFullYear()} Warranty Wallet</span>
        </div>
      </footer>
    </div>
  );
}

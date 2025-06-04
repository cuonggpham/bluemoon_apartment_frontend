import "./home-page.css";
import { useEffect } from "react";

const HomePage = () => {
  useEffect(() => {
    // Smooth scroll behavior
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector((link as HTMLAnchorElement).getAttribute('href')!);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.observe').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="modern-homepage">
      {/* Navigation */}
      <nav className="modern-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-text">BlueMoon</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a href="/signin" className="nav-cta">Sign In</a>
          </div>
          <div className="nav-mobile">
            <button className="mobile-toggle" aria-label="Toggle navigation menu">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content observe">
            <h1 className="hero-title">
              Redefining
              <span className="gradient-text"> Condominium</span>
              <br />Management
            </h1>
            <p className="hero-subtitle">
              Experience the future of property management with our elegant, 
              intuitive platform designed for modern living.
            </p>
            <div className="hero-actions">
              <a href="/signin" className="primary-button">
                Get Started
                <svg className="button-arrow" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#features" className="secondary-button">
                Learn More
              </a>
            </div>
          </div>
          <div className="hero-visual observe">
            <div className="visual-container">
              <div className="floating-card card-1">
                <div className="card-icon">🏢</div>
                <div className="card-text">Smart Building</div>
              </div>
              <div className="floating-card card-2">
                <div className="card-icon">📊</div>
                <div className="card-text">Analytics</div>
              </div>
              <div className="floating-card card-3">
                <div className="card-icon">🔐</div>
                <div className="card-text">Secure Access</div>
              </div>
              <div className="center-graphic">
                <div className="graphic-ring ring-1"></div>
                <div className="graphic-ring ring-2"></div>
                <div className="graphic-ring ring-3"></div>
                <div className="graphic-core"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header observe">
            <h2 className="section-title">Thoughtfully Designed</h2>
            <p className="section-subtitle">
              Every feature crafted with precision to enhance your daily experience
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card observe">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="m2 17 10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="m2 12 10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Unified Dashboard</h3>
              <p>Centralized control for all building operations with intuitive navigation and real-time insights.</p>
            </div>
            <div className="feature-card observe">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Smart Automation</h3>
              <p>Automated workflows that streamline maintenance, billing, and resident communication seamlessly.</p>
            </div>
            <div className="feature-card observe">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Enterprise Security</h3>
              <p>Bank-level encryption and multi-factor authentication protecting your sensitive data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="section-container">
          <div className="about-content">
            <div className="about-text observe">
              <h2 className="section-title">Built for Tomorrow</h2>
              <p className="about-description">
                We believe technology should enhance human connection, not complicate it. 
                Our platform brings communities together through elegant design and 
                powerful functionality.
              </p>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Buildings Managed</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">99.9%</span>
                  <span className="stat-label">Uptime</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Support</span>
                </div>
              </div>
            </div>
            <div className="about-visual observe">
              <div className="visual-grid">
                <div className="grid-item item-1"></div>
                <div className="grid-item item-2"></div>
                <div className="grid-item item-3"></div>
                <div className="grid-item item-4"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="section-container">
          <div className="contact-content observe">
            <h2 className="section-title">Ready to Transform?</h2>
            <p className="section-subtitle">
              Join thousands of properties already using BlueMoon to create 
              exceptional living experiences.
            </p>
            <div className="contact-actions">
              <a href="/signin" className="primary-button large">
                Start Your Journey
              </a>
              <a href="mailto:contact@bluemoon.com" className="contact-link">
                contact@bluemoon.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="modern-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="logo-text">BlueMoon</span>
              <p>Redefining property management</p>
            </div>
            <div className="footer-links">
              <a href="#features">Features</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
              <a href="/signin">Sign In</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 BlueMoon. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

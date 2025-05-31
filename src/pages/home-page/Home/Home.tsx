import { useEffect, useRef } from "react";
import { assets } from "../../../assets/assets";
import TechMarquee from "../partials/TechMarquee";
import "./home.css";
import Typed from "typed.js";
import anime from "animejs";

const Home = () => {
  const typedElement = useRef(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const typed = new Typed(typedElement.current, {
      strings: ["Discover And Manage Exclusive Condo Amenities"],
      typeSpeed: 80,
      backSpeed: 90,
      loop: true
    });

    // Hero section entrance animations
    anime({
      targets: leftContentRef.current,
      translateX: [-100, 0],
      opacity: [0, 1],
      duration: 1000,
      easing: 'easeOutCubic',
      delay: 800
    });

    anime({
      targets: rightContentRef.current,
      translateX: [100, 0],
      opacity: [0, 1],
      duration: 1000,
      easing: 'easeOutCubic',
      delay: 1000
    });

    // Stagger animation for text elements
    anime({
      targets: '.left__title, .left__desc',
      translateY: [50, 0],
      opacity: [0, 1],
      duration: 800,
      delay: anime.stagger(200, {start: 1200}),
      easing: 'easeOutCubic'
    });

    // Buttons animation
    anime({
      targets: '.button',
      scale: [0.8, 1],
      opacity: [0, 1],
      duration: 600,
      delay: anime.stagger(150, {start: 1600}),
      easing: 'easeOutBack'
    });

    // Image floating animation
    anime({
      targets: '.right__img img',
      translateY: [0, -20, 0],
      duration: 4000,
      loop: true,
      easing: 'easeInOutSine'
    });

    // Add hover animations for buttons
    const buttons = document.querySelectorAll('.button');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        anime({
          targets: button,
          scale: 1.05,
          translateY: -3,
          duration: 200,
          easing: 'easeOutCubic'
        });
      });

      button.addEventListener('mouseleave', () => {
        anime({
          targets: button,
          scale: 1,
          translateY: 0,
          duration: 200,
          easing: 'easeOutCubic'
        });
      });
    });

    return () => {
      typed.destroy();
    };
  }, []);

  const handleSmoothScroll = (event: any) => {
    event.preventDefault();
    const targetId = event.target.getAttribute("href").slice(1);
    const targetElement : any = document.getElementById(targetId);

    targetElement.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  return (
    <>
      <section className="home" id="home">
        <div className="container-tdn full-height-page">
          <div className="home__main" ref={heroRef}>
            <div className="main__left" ref={leftContentRef}>
              <div className="left__title">
                <span ref={typedElement}></span>
              </div>

              <div className="left__desc">
                Your All-in-One Solution for Condominium Management
              </div>
              
              <div className="left__button" ref={buttonsRef}>
                <a href="/signin" className="button button__active">
                  <span>Sign In</span>
                  <svg className="button-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <a
                  href="#contact-us"
                  className="button button-contact"
                  onClick={handleSmoothScroll}
                >
                  <span>Contact Us</span>
                  <svg className="button-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="main__right" ref={rightContentRef}>
              <div className="right__img">
                <div className="image-container">
                  <img src={assets.homepage_main} alt="computer_img" />
                  <div className="image-glow"></div>
                </div>
              </div>
            </div>
          </div>

          <TechMarquee />
        </div>
      </section>
    </>
  );
};

export default Home;

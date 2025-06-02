import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import './Header.css'

const handleClickLogo = () => {
    window.scrollTo({
        top: 0,       // Cuộn về đầu trang
        behavior: 'smooth' // Hiệu ứng cuộn mượt
    })
}

const Header = () => {
    const headerRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLUListElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Header entrance animation
        if (headerRef.current) {
            animate(headerRef.current, {
                translateY: [-50, 0],
                opacity: [0, 1],
                duration: 800,
                easing: 'easeOutCubic',
                delay: 200
            });
        }

        // Logo animation
        if (logoRef.current) {
            animate(logoRef.current, {
                scale: [0.8, 1],
                opacity: [0, 1],
                duration: 600,
                easing: 'easeOutBack',
                delay: 400
            });
        }

        // Menu items stagger animation
        animate('.item-menu', {
            translateY: [-30, 0],
            opacity: [0, 1],
            duration: 500,
            delay: stagger(100, {start: 600}),
            easing: 'easeOutCubic'
        });

        // Hover animations for menu items
        const menuItems = document.querySelectorAll('.item-menu');
        menuItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                animate(item, {
                    scale: 1.05,
                    duration: 200,
                    easing: 'easeOutCubic'
                });
            });

            item.addEventListener('mouseleave', () => {
                animate(item, {
                    scale: 1,
                    duration: 200,
                    easing: 'easeOutCubic'
                });
            });
        });

        // Logo hover animation
        if (logoRef.current) {
            logoRef.current.addEventListener('mouseenter', () => {
                if (logoRef.current) {
                    animate(logoRef.current, {
                        rotate: [0, 5],
                        scale: 1.05,
                        duration: 300,
                        easing: 'easeOutCubic'
                    });
                }
            });

            logoRef.current.addEventListener('mouseleave', () => {
                if (logoRef.current) {
                    animate(logoRef.current, {
                        rotate: [5, 0],
                        scale: 1,
                        duration: 300,
                        easing: 'easeOutCubic'
                    });
                }
            });
        }
    }, []);

    return (
        <div className="home-page__header" ref={headerRef}>
            <div className="inner-header">
                <div className="header__logo" onClick={handleClickLogo} ref={logoRef}>
                    .HustCity
                </div>
                <div className="header__menu">
                    <ul className='inner-menu' ref={menuRef}>
                        <li className='item-menu active'><a href="#home">Home</a></li>
                        <li className='item-menu'><a href="#about-us">About</a></li>
                        <li className='item-menu'><a href="#our-team">Our Team</a></li>
                        <li className='item-menu'><a href="#contact-us">Contact</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Header
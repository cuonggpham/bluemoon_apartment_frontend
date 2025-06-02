import { useEffect, useRef } from "react";
import { assets } from "../../../../assets/assets"
import './TechMarquee.css'
import { animate, stagger } from "animejs";

const TechMarquee = () => {
    const marqueeRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Title animation
        if (titleRef.current) {
            animate(titleRef.current, {
                translateY: [30, 0],
                opacity: [0, 1],
                duration: 600,
                easing: 'easeOutCubic',
                delay: 2000
            });
        }

        // Tech items animation
        animate('.tech__item', {
            translateY: [40, 0],
            opacity: [0, 1],
            duration: 500,
            delay: stagger(100, {start: 2200}),
            easing: 'easeOutCubic'
        });

        // Hover animations for tech items
        const techItems = document.querySelectorAll('.tech__item');
        techItems.forEach(item => {
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
    }, []);

    return (
        <div className="home__tech">
            <div className="container-tdn2">
                <div className="inner-tech">
                    <div className="desc" ref={titleRef}>Technology Stack</div>
                    <div className="wrap-tdn" ref={marqueeRef}>
                        <div className="tech__main">
                            <div className="tech__item">
                                <div className="item__icon">
                                    <img src={assets.react}
                                        alt="react" />
                                </div>
                                <div className="item__content">React</div>
                            </div>
                            <div className="tech__item">
                                <div className="item__icon">
                                    <img src={assets.spring_boot}
                                        alt="spring" />
                                </div>
                                <div className="content">Spring Boot</div>
                            </div>
                            <div className="tech__item">
                                <div className="item__icon">
                                    <img src={assets.mysql}
                                        alt="mysql" />
                                </div>
                                <div className="content">MySQL</div>
                            </div>
                            <div className="tech__item">
                                <div className="item__icon">
                                    <img src={assets.docker}
                                        alt="docker" />
                                </div>
                                <div className="content">Docker</div>
                            </div>
                            <div className="tech__item">
                                <div className="item__icon">
                                    <img src={assets.rest_api}
                                        alt="rest" />
                                </div>
                                <div className="content">REST API</div>
                            </div>
                            <div className="tech__item">
                                <div className="item__icon">
                                    <img src={assets.java}
                                        alt="java" />
                                </div>
                                <div className="content">Java</div>
                            </div>
                            <div className="tech__item">
                                <div className="item__icon">
                                    <img src={assets.typescript}
                                        alt="typescript" />
                                </div>
                                <div className="content">TypeScript</div>
                            </div>
                        </div>
                        <div className="tech__main">
                            <div className="tech__item">
                                <div className="item__icon">
                                    <img src={assets.react}
                                        alt="react" />
                                </div>
                                <div className="item__content">React</div>
                            </div>
                            <div className="tech__item">
                                <div className="item__icon">
                                    <img src={assets.spring_boot}
                                        alt="spring" />
                                </div>
                                <div className="content">Spring Boot</div>
                            </div>
                            <div className="tech__item">
                                <div className="item__icon">
                                    <img src={assets.mysql}
                                        alt="mysql" />
                                </div>
                                <div className="content">MySQL</div>
                            </div>
                            <div className="tech__item">
                                <div className="item__icon">
                                    <img src={assets.tailwind}
                                        alt="tailwind" />
                                </div>
                                <div className="content">TailwindCSS</div>
                            </div>
                            <div className="tech__item">
                                <div className="item__icon">
                                    <img src={assets.rest_api}
                                        alt="rest" />
                                </div>
                                <div className="content">REST API</div>
                            </div>
                            <div className="tech__item">
                                <div className="item__icon">
                                    <img src={assets.java}
                                        alt="java" />
                                </div>
                                <div className="content">Java</div>
                            </div>
                            <div className="tech__item">
                                <div className="item__icon">
                                    <img src={assets.typescript}
                                        alt="typescript" />
                                </div>
                                <div className="content">TypeScript</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TechMarquee
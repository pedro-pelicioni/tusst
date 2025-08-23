import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const FireSparks = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const density = 70;
    const speed = 2;
    const winHeight = window.innerHeight;
    const winWidth = window.innerWidth;

    const start = {
      yMin: winHeight - 50,
      yMax: winHeight,
      xMin: (winWidth / 2) + 10,
      xMax: (winWidth / 2) + 40,
      scaleMin: 0.1,
      scaleMax: 0.25,
      scaleXMin: 0.1,
      scaleXMax: 1,
      scaleYMin: 1,
      scaleYMax: 2,
      opacityMin: 0.1,
      opacityMax: 0.4
    };

    const mid = {
      yMin: winHeight * 0.4,
      yMax: winHeight * 0.9,
      xMin: winWidth * 0.1,
      xMax: winWidth * 0.9,
      scaleMin: 0.2,
      scaleMax: 0.8,
      opacityMin: 0.5,
      opacityMax: 1
    };

    const end = {
      yMin: -180,
      yMax: -180,
      xMin: -100,
      xMax: winWidth + 180,
      scaleMin: 0.1,
      scaleMax: 1,
      opacityMin: 0.4,
      opacityMax: 0.7
    };

    function range(map: any, prop: string) {
      const min = map[prop + 'Min'];
      const max = map[prop + 'Max'];
      return min + (max - min) * Math.random();
    }

    function randomEase(easeThis: any, easeThat: any) {
      if (Math.random() < 0.5) {
        return easeThat;
      }
      return easeThis;
    }

    function spawn(particle: HTMLElement) {
      const wholeDuration = (10 / speed) * (0.7 + Math.random() * 0.4);
      const delay = wholeDuration * Math.random();
      let partialDuration = (wholeDuration + 1) * (0.2 + Math.random() * 0.3);

      gsap.set(particle, {
        y: range(start, 'y'),
        x: range(start, 'x'),
        scaleX: range(start, 'scaleX'),
        scaleY: range(start, 'scaleY'),
        scale: range(start, 'scale'),
        opacity: range(start, 'opacity'),
        visibility: 'hidden'
      });

      // Moving upward
      gsap.to(particle, {
        duration: partialDuration,
        delay: delay,
        y: range(mid, 'y'),
        ease: randomEase("none", "back.inOut")
      });

      gsap.to(particle, {
        duration: wholeDuration - partialDuration,
        delay: partialDuration + delay,
        y: range(end, 'y'),
        ease: "back.in"
      });

      // Moving on axis X
      gsap.to(particle, {
        duration: partialDuration,
        delay: delay,
        x: range(mid, 'x'),
        ease: "power1.out"
      });

      gsap.to(particle, {
        duration: wholeDuration - partialDuration,
        delay: partialDuration + delay,
        x: range(end, 'x'),
        ease: "power1.in"
      });

      // Opacity and scale
      partialDuration = wholeDuration * (0.5 + Math.random() * 0.3);
      gsap.to(particle, {
        duration: partialDuration,
        delay: delay,
        scale: range(mid, 'scale'),
        autoAlpha: range(mid, 'opacity'),
        ease: "none"
      });

      gsap.to(particle, {
        duration: wholeDuration - partialDuration,
        delay: partialDuration + delay,
        scale: range(end, 'scale'),
        autoAlpha: range(end, 'opacity'),
        ease: "none",
        onComplete: () => spawn(particle)
      });
    }

    function createParticles() {
      for (let i = 0; i < density; i += 1) {
        const particleSpark = document.createElement('div');
        particleSpark.classList.add('spark');
        containerRef.current?.appendChild(particleSpark);
        spawn(particleSpark);
      }
    }

    createParticles();

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 pointer-events-none" />;
};

export default FireSparks;
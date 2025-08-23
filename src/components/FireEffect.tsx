import { useEffect } from "react";

const FireEffect = () => {
  useEffect(() => {
    const parent = document.getElementById("fire_sparks");
    const styles = document.getElementById("fire_sparks_styles");
    
    if (!parent || !styles) {
      console.log("Elements not found:", { parent: !!parent, styles: !!styles });
      return;
    }
    
    const totalSparks = 50; // Reduced for better performance
    const randomSizeAndSpeed = true;
    
    const smallRandom = (min: number, max: number) => {
      return (Math.random() * (max - min) + min).toFixed(2);
    };
    
    const bigRandom = (min: number, max: number) => {
      return (Math.random() * (max - min) + min).toFixed(0);
    };
    
    const sparkHTML = (
      index: number,
      innerSpeed: string,
      innerDelay: string,
      sparkTravelSpeed: string,
      sparkTravelDelay: string
    ) => {
      let fixedIndex: number | string;
      let fixedInnerSpeed: number;
      
      if (!randomSizeAndSpeed) {
        fixedIndex = '';
        fixedInnerSpeed = 2000;
      } else {
        fixedIndex = index;
        fixedInnerSpeed = parseInt(innerSpeed);
      }
      
      return `<div class="spark" style="animation-name: travel${index}; animation-duration: ${sparkTravelSpeed}ms; animation-delay: ${sparkTravelDelay}ms;"><div class="spark_inner" style="animation-name: scaling${fixedIndex}; animation-duration: ${fixedInnerSpeed}ms; animation-delay:${innerDelay}ms;"></div></div>`;
    };
    
    // Clear previous content
    parent.innerHTML = '';
    styles.innerHTML = '';
    
    console.log("Starting fire effect generation...");
    
    for (let i = 0; i < (totalSparks + 1); i++) {
      if (!randomSizeAndSpeed && i === 0) {
        styles.innerHTML = "@keyframes scaling {0% {transform: scale3d(0.4, 0.4, 1);} 50% {transform: scale3d(1.4, 1.4, 1);} 100% {transform: scale3d(0.4, 0.4, 1);}}";
      }
      
      if (randomSizeAndSpeed) {
        const min = smallRandom(0.2, 0.5);
        const max = smallRandom(1.2, 2);
        styles.innerHTML += `@keyframes scaling${i} {0% {transform: scale3d(${min}, ${min}, 1);} 50% {transform: scale3d(${max}, ${max}, 1);} 100% {transform: scale3d(${min}, ${min}, 1);}}`;
      }
      
      // Better positioning for sparks
      const point1w = bigRandom(20, 80);
      const point1h = 110;
      const point2w = bigRandom(10, 90);
      const point2h = -10;
      styles.innerHTML += `@keyframes travel${i} { 0% {transform: translate(${point1w}vw, ${point1h}vh)} 100% {transform: translate(${point2w}vw, ${point2h}vh);} }`;
      
      const innerSpeed = bigRandom(1000, 2500);
      const innerDelay = bigRandom(0, 1000);
      const speed = bigRandom(8000, 15000);
      const delay = bigRandom(0, 10000);
      
      parent.innerHTML += sparkHTML(i, innerSpeed, innerDelay, speed, delay);
    }
    
    console.log("Fire effect generated with", totalSparks, "sparks");
  }, []);

  return (
    <>
      <div id="fire_sparks" className="fire-sparks-container" />
      <style id="fire_sparks_styles" />
    </>
  );
};

export default FireEffect;
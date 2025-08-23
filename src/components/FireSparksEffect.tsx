import { useEffect } from "react";

const FireSparksEffect = () => {
  useEffect(() => {
    const parent = document.getElementById("fire_sparks");
    const styles = document.getElementById("fire_sparks_styles");
    
    if (!parent || !styles) return;

    const total_sparks = 69;
    const random_size_and_speed = true;
    
    const small_random = (min: number, max: number) => {
      return (Math.random() * (max - min) + min).toFixed(2);
    };
    
    const big_random = (min: number, max: number) => {
      return (Math.random() * (max - min) + min).toFixed(0);
    };
    
    // Clear existing content
    parent.innerHTML = "";
    styles.innerHTML = `#fire_sparks{width:100%;height:100%;position:absolute;inset:0;pointer-events:none;overflow:hidden;}#fire_sparks .spark{transform:none!important;}`;
    
    // the HTML creator function
    const spark_HTML = (index: number, inner_speed: string, inner_delay: string, spark_travel_speed: string, spark_travel_delay: string) => {
      let fixed_index;
      let fixed_inner_speed;
      // check if we random_size_and_speed is true or not
      if (!random_size_and_speed) {
        fixed_index = '';
        fixed_inner_speed = '2000';
      } else {
        fixed_index = index;
        fixed_inner_speed = inner_speed;
      }
      // we are returning the HTML code for each spark here every time the spark_HTML function is called by the loop below
      return `<div class="spark" style="animation-name: travel${index}; animation-duration: ${spark_travel_speed}ms; animation-delay: ${spark_travel_delay}ms;"><div class="spark_inner" style="animation-name: scaling${fixed_index}; animation-duration: ${fixed_inner_speed}ms; animation-delay:${inner_delay}ms;"></div></div>`;
    };

    // loop to create all sparks
    for(let i = 0; i < (total_sparks + 1); i++) {
      // if random random_size_and_speed is not activated we add the keyframe once
      if (!random_size_and_speed && i === 0) {
        styles.innerHTML = "@keyframes scaling {0% {transform: scale3d(0.4, 0.4, 1);} 50% {transform: scale3d(1.4, 1.4, 1);} 100% {transform: scale3d(0.4, 0.4, 1);}}";
      }
      // if random_size_and_speed is activated we add a different value keyframe for each spark
      if (random_size_and_speed) {
        let min = small_random(0.1, 0.4); // set the min size value range
        let max = small_random(1, 1.5); // set the max size value range
        styles.innerHTML += `@keyframes scaling${i} {0% {transform: scale3d(${min}, ${min}, 1);} 50% {transform: scale3d(${max}, ${max}, 1);} 100% {transform: scale3d(${min}, ${min}, 1);}}`;
      }
      
      // random travel directions bound to section (percentages)
      let point1w = big_random(0, 100); // initial X (% of section width)
      let point2w = big_random(0, 100); // final X (% of section width)
      styles.innerHTML += `@keyframes travel${i} { 0% { top: 103%; left: ${point1w}%; } 100% { top: -3%; left: ${point2w}%; } }`;    
      
      let inner_speed = big_random(1500, 2000); // milliseconds
      // call the random function to get a random inner_delay
      let inner_delay = big_random(1, 1200); // milliseconds
      // call the random function to get a random number for this spark's travel duration
      let speed = big_random(6000, 18000); // milliseconds
      // call the random function to get a random number for this spark's travel speed
      let delay = big_random(1, 15000); // milliseconds
      
      // duplicate the HTML structure for the fire sparks but with different parameters every time
      parent.innerHTML += spark_HTML(i, inner_speed, inner_delay, speed, delay);
    }

    // Cleanup function
    return () => {
      if (parent) parent.innerHTML = "";
      if (styles) styles.innerHTML = "";
    };
  }, []);

  return (
    <>
      <div id="fire_sparks" className="fire-sparks-container" />
      <style id="fire_sparks_styles" />
    </>
  );
};

export default FireSparksEffect;
import React, { useState } from "react";
import { useSprings, animated, interpolate } from "react-spring/hooks";
import { useGesture } from "react-with-gesture";
import Ingredients from "./Ingredients";

// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = i => ({
  x: 0,
  y: i * 10,
  scale: 1,
  rot: -5 + Math.random() * 10,
  delay: i * 100
});
const from = i => ({ rot: 0, scale: 1.5, y: -1000 });
// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r, s) =>
  `rotateX(30deg) rotateY(0deg) rotateZ(${r}deg) scale(${s})`;

function Decks(props) {
  // The set flags all the props.receipts that are flicked out
  const [gone] = useState(() => new Set());
  // Create a bunch of springs that contain x/y-position, rotation and scale - using the helpers above

  const [decks, set] = useSprings(props.receipts.length, i => ({
    ...to(i),
    from: from(i)
  }));

  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
  const bind = useGesture(
    ({
      args: [index],
      down,
      delta: [xDelta],
      distance,
      direction: [xDir],
      velocity
    }) => {
      // If you flick hard enough it should trigger the card to fly out
      const trigger = velocity > 0.2;
      // Direction should either point left or right
      const dir = xDir < 0 ? -1 : 1;
      // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
      if (!down && trigger) gone.add(index);
      // useSprings.set reconfigures the springs
      set(i => {
        // We're only interested in changing spring-data for the current spring
        if (index !== i) return;
        const isGone = gone.has(index);
        // When a card is gone it flys out left or right, otherwise it's either dragged to delta, or goes back to zero
        const x = isGone ? (200 + window.innerWidth) * dir : down ? xDelta : 0;
        if (x > window.innerWidth) {
          props.notification("success", "Started cooking!");
          setTimeout(() => props.acceptRecipe(props.receipts[index]), 500);
        }
        // How much the card tilts, flicking it harder makes it rotate faster
        const rot = xDelta / 100 + (isGone ? dir * 10 * velocity : 0);
        // Active props.receipts lift up a bit
        const scale = down ? 1.1 : 1;
        return {
          x,
          rot,
          scale,
          delay: undefined,
          config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 }
        };
      });
      // When all props.receipts are removed, make a reset
      if (!down && gone.size === props.receipts.length)
        setTimeout(() => gone.clear() || set(i => to(i)), 600);
    }
  );
  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)

  return decks.map(({ x, y, rot, scale }, i) => (
    <animated.div
      className="deck"
      key={i}
      style={{
        transform: interpolate(
          [x, y],
          (x, y) => `translate3d(${x}px,${y * 25}px,0)`
        )
      }}
    >
      {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
      <animated.div
        {...bind(i)}
      >
        <h2>{props.receipts[i].title}</h2>
        <Ingredients active={props.receipts[i]}/>

      </animated.div>
    </animated.div>
  ));
}

export default Decks;

import { keyframes } from "styled-components";

export const getBreathDirection = (time: number, isBox: boolean) => {
  if (isBox) {
    const state = time % 16;
    if (state < 4) {
      return "In";
    } else if (state < 8) {
      return "Hold";
    } else if (state < 12) {
      return "Out";
    } else {
      return "Hold";
    }
  } else {
    return time % 8 < 4 ? "In" : "Out";
  }
};

export const evenBreath = keyframes`    
  from {
    transform: scale(0.3);
    rotate: 0deg;
  }

  to {
    transform: scale(1.25);
    rotate: 270deg;
  }
`;

// 0px, 0px
export const expand = (fromPoint: string, toPoint: string) => keyframes`    
  from {
    transform: translate(${fromPoint});
  }

  to {
    transform: translate(${toPoint});
  }
`;

export const boxBreath = keyframes`
  // in
  0% {
    transform: scale(0.3);
  }

  25% {
    transform: scale(1.05);
  }

  // hold
  40% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05)
  }

  // out
  75% {
    transform: scale(0.3);
  }
  // hold
  90% {
    transform: scale(0.35);
  }
`;

import React, { useContext, useState } from "react";
import styled from "styled-components";
import BaseBorder from "../FancyBorder";
import { DarkModeToggle, ThemeContext } from "../../providers/ThemeProvider";

const Header: React.FC<{ className?: string }> = ({ className }) => {
  const { color, setColor } = useContext(ThemeContext);
  const [showColor, setShowColor] = useState(false);

  return (
    <Wrapper className={className}>
      <FlexWrapper>
        <ColorChangeButton
          onClick={() => {
            setShowColor((color) => !color);
          }}
        >
          <Title>Delivery Time!</Title>
        </ColorChangeButton>
        {showColor && (
          <input
            type="number"
            value={color}
            onChange={(event) =>
              setColor(Number.parseInt(event.target.value) % 360)
            }
          />
        )}
        <DarkMode />
      </FlexWrapper>
      <FancyBorder />
    </Wrapper>
  );
};

const Wrapper = styled.header`
  background-image: linear-gradient(
    90deg,
    var(--background-color) 0%,
    var(--gray-one) 50%,
    var(--background-color) 98%
  );
`;

const FlexWrapper = styled.div`
  display: flex;
`;

const Title = styled.h1`
  font-size: 3rem;
  padding-top: 1.5rem;
`;

const DarkMode = styled(DarkModeToggle)`
  align-self: baseline;
  margin: auto 16px;
`;

const FancyBorder = styled(BaseBorder)``;

const ColorChangeButton = styled.button`
  display: block;
  margin: auto;
  border: none;
  color: var(--text-color);
  background-color: transparent;
`;

export default React.memo(Header);

/* background-image: conic-gradient(
    from 270deg at 50% -20%,
    var(--background-color) 50%,
    hsl(120deg 40% 10%),
    hsl(120deg 30% 15%),
    hsl(120deg 40% 10%),
    var(--background-color)
  );

   background-image: conic-gradient(
    from 270deg at 50% -20%,
    hsl(240deg 40% 5%) 50%,
    hsl(250deg 40% 20%),
    hsl(250deg 30% 25%),
    hsl(250deg 40% 20%),
    hsl(240deg 40% 5%)
  ); */

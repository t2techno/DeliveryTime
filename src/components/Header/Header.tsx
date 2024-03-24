import React, { useContext, useState } from "react";
import styled from "styled-components";
import BaseBorder from "../FancyBorder";
import { DarkModeToggle, ThemeContext } from "../../Providers/ThemeProvider";

const Header: React.FC<{ className?: string }> = ({ className }) => {
  console.info("Header ReRender");
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

const Wrapper = styled.header``;

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

const FancyBorder = styled(BaseBorder)`
  margin-top: -10%;
`;

const ColorChangeButton = styled.button`
  display: block;
  margin: auto;
  border: none;
  color: var(--text-color);
  background-color: transparent;
`;

export default Header;

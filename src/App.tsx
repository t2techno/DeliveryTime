import React, { useState } from "react";
import "./App.css";
import styled from "styled-components";
import BaseHeader from "./components/Header";
import FancyBorder from "./components/FancyBorder";

function App() {
  return (
    <Wrapper>
      <Header />
      <FancyBorder color="var(--dark-mode-background)" />
    </Wrapper>
  );
}

const Wrapper = styled.main`
  height: 100%;
  width: 100%;
  background-color: var(--dark-mode-background);
  color: var(--dark-mode-text-color);
`;

const Header = styled(BaseHeader)`
  height: 30%;
`;

export default App;

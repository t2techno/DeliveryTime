import React, { useState } from "react";
import "./App.css";
import styled from "styled-components";
import BaseHeader from "./components/Header";
import FancyBorder from "./components/FancyBorder";

function App() {
  return (
    <Main>
      <MaxWidthWrapper>
        <Header />
        <FancyBorder color="var(--dark-mode-background)" />
      </MaxWidthWrapper>
    </Main>
  );
}

const Main = styled.main`
  height: 100%;
  width: 100%;
  background-color: var(--dark-mode-background);
  color: var(--dark-mode-text-color);
`;

const MaxWidthWrapper = styled.body`
  height: 100%;
  width: 100%;
  max-width: 800px;
  margin: auto;
`;

const Header = styled(BaseHeader)``;

export default App;

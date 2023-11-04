import { Button, Container } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Container maxW={"620px"}>
      <Routes>
        <Route path="/:username" element={<UserPage />}></Route>
        <Route path="/:username/post/:pid" element={<UserPage />}></Route>
      </Routes>
      <Button>clear</Button>
    </Container>
  );
}

export default App;

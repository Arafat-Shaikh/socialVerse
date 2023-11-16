import { Button, Container } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import Header from "./components/Header";
import PostPage from "./pages/PostPage";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilState } from "recoil";
import userAtom from "./atoms/userAtom";
import UpdateUserPage from "./pages/UpdateUserPage";

function App() {
  const [user, setUser] = useRecoilState(userAtom);
  return (
    <Container maxW={"620px"}>
      <Header />
      <Routes>
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to={"/auth"} />}
        ></Route>
        <Route
          path="/auth"
          element={!user ? <AuthPage /> : <HomePage />}
        ></Route>
        <Route
          path="/update"
          element={user ? <UpdateUserPage /> : <Navigate to={"/auth"} />}
        ></Route>
        <Route path="/:username" element={<UserPage />}></Route>
        <Route path="/:username/post/:pid" element={<PostPage />}></Route>
      </Routes>
    </Container>
  );
}

export default App;

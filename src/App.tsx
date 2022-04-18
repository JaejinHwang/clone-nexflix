import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/tv" element={<Tv />} />
        <Route path="/search" element={<Search />} />
        <Route path="/" element={<Home />}>
          <Route path="/movies/popular/:movieId" element={<Home />} />
          <Route path="/movies/upcoming/:movieId" element={<Home />} />
          <Route path="/movies/top_rated/:movieId" element={<Home />} />
          <Route path="/movies/now_playing/:movieId" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

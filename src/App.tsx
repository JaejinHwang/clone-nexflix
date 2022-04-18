import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";
import "remixicon/fonts/remixicon.css";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/tv" element={<Tv />}>
          <Route path="/tv/popular/:tvId" element={<Tv />} />
          <Route path="/tv/airing_today/:tvId" element={<Tv />} />
          <Route path="/tv/top_rated/:tvId" element={<Tv />} />
          <Route path="/tv/on_the_air/:tvId" element={<Tv />} />
        </Route>
        <Route path="/search" element={<Search />}>
          <Route path="/search/:movieId" element={<Search />} />
          <Route path="/search/:tvId" element={<Search />} />
        </Route>
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

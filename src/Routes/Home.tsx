import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { GetPopularMovies, IMovie } from "../api";
import { makeMovieImageUrl } from "../utils";

const Background = styled.div<{ bgUrl: string }>`
  width: 100%;
  height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgUrl});
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Introduction = styled.section`
  padding: 0px 60px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 30px;
`;

const Title = styled.h1`
  font-size: 60px;
  font-weight: 500;
`;

const Overview = styled.p`
  width: 60%;
  max-width: 900px;
  font-size: 24px;
  line-height: 1.25em;
`;

const Slider = styled.div`
  width: 100%;
  position: relative;
  top: -100px;
  padding-bottom: 3000px;
`;

const Row = styled(motion.div)<{ offset: number }>`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(${(props) => props.offset}, 1fr);
  position: absolute;
  width: 100%;
`;

const PosterCard = styled(motion.div)<{ bgUrl: string }>`
  background-image: url(${(props) => props.bgUrl});
  background-size: cover;
  background-position: center center;
  height: 200px;
  &: first-child {
    transform-origin: center left;
  }
  &: last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  // opacity: 0;
  height: 40px;
  background-color: ${(props) => props.theme.black.lighter};
  position: absolute;
  bottom: 0px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 16px;
`;

const sliderVariants = {
  hidden: {
    x: window.outerWidth + 10,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 10,
  },
};

const posterVariants = {
  default: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    transition: {
      delay: 0.25,
      type: "tween",
    },
  },
};

const infoVariants = {
  default: {
    opacity: 0,
  },
  hover: {
    opacity: 1,
    transition: {
      delay: 0.25,
      type: "tween",
    },
  },
};

function Home() {
  const sliderOffset = 6;
  const { data, isLoading } = useQuery(["Movie", "Popular"], GetPopularMovies);
  const [index, setIndex] = useState(0);
  const [isExit, setIsExit] = useState(false);
  const toggleIsExit = () => setIsExit((prev) => !prev);
  const incraseIndex = () => {
    if (data) {
      if (!isExit) {
        toggleIsExit();
        const totalMovies = data.results.length - 1;
        const maxIndex = Math.floor(totalMovies / sliderOffset) - 1;
        setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      }
    }
  };
  const decraseIndex = () => setIndex((prev) => (prev === 0 ? 2 : prev - 1));
  return (
    <>
      <Background
        bgUrl={makeMovieImageUrl(data?.results[0].backdrop_path || "")}
      >
        {isLoading ? (
          "Loading..."
        ) : (
          <Introduction>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Introduction>
        )}
      </Background>
      <Slider onClick={incraseIndex}>
        <AnimatePresence initial={false} onExitComplete={toggleIsExit}>
          <Row
            offset={sliderOffset}
            variants={sliderVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", duration: 1 }}
            key={index}
          >
            {data?.results
              .slice(1)
              .slice(index * sliderOffset, index * sliderOffset + sliderOffset)
              .map((movie: IMovie) => (
                <PosterCard
                  variants={posterVariants}
                  initial="default"
                  whileHover="hover"
                  key={movie.id}
                  bgUrl={makeMovieImageUrl(movie.poster_path, "w500")}
                >
                  <Info variants={infoVariants}>{movie.title}</Info>
                </PosterCard>
              ))}
          </Row>
        </AnimatePresence>
      </Slider>
    </>
  );
}
export default Home;

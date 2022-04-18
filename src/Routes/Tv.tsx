import { useViewportScroll } from "framer-motion";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { GetPopularMovies, GetPopularTvs, IMovie, ITv } from "../api";
import AiringTodayTv from "../Components/AiringTodayTv";
import OnTheAirTv from "../Components/OnTheAirTv";
import PopularTv from "../Components/PopularTv";
import TopRatedTv from "../Components/TopRatedTv";
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

const SliderContainer = styled.div`
  position: relative;
  top: -200px;
`;

function Tv() {
  const { data, isLoading } = useQuery(["Tv", "Popular"], GetPopularTvs);
  return (
    <>
      <Helmet>
        <title>TV Shows</title>
      </Helmet>
      <Background
        bgUrl={makeMovieImageUrl(data?.results[0].backdrop_path || "")}
      >
        {isLoading ? (
          "Loading..."
        ) : (
          <Introduction>
            <Title>{data?.results[0].name}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Introduction>
        )}
      </Background>
      <SliderContainer>
        <AiringTodayTv />
        <PopularTv />
        <TopRatedTv />
        <OnTheAirTv />
      </SliderContainer>
    </>
  );
}
export default Tv;

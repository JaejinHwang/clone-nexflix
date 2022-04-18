import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { GetSearchedMovies, GetSearchedTvs } from "../api";
import styled from "styled-components";
import SearchMovie from "../Components/SearchMovie";
import { Helmet } from "react-helmet";
import SearchTv from "../Components/SearchTv";

const SearchTitle = styled.h1`
  margin: 0px 60px;
  margin-top: 100px;
  margin-bottom: 100px;
  font-size: 48px;
  font-weight: 500;
`;

function Search() {
  const location = useLocation();
  const input = new URLSearchParams(location.search).get("search");
  const { data: searchTvData, isLoading: tvLoading } = useQuery(
    ["search", "tv", `${input}`],
    () => GetSearchedTvs(input)
  );

  return (
    <>
      <Helmet>
        <title>Search Result: {input}</title>
      </Helmet>
      <SearchTitle>Search Results for '{input?.split("/")[0]}':</SearchTitle>
      <SearchMovie search={input} />
      <SearchTv search={input} />
    </>
  );
}
export default Search;

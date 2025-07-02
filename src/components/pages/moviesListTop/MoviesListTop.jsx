import React, { useEffect, useState } from 'react';
import { useGetFilmsQuery, useGetGenresAndCountriesQuery } from '../../../services/kinopoiskApi';
import { MOVIE_LISTS } from '../../../constants';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Stack, Typography, useTheme, useMediaQuery, Box } from '@mui/material';
import MoviesList from '../../ui/moviesList/MoviesList';
import { ArrowBack } from '@mui/icons-material';
import ErrorMessage from '../../ui/errorMessage/ErrorMessage';
import MoviesListTopSkeleton from '../../ui/moviesListTopSkeleton/MoviesListMainSkeleton';
import { useSelector, useDispatch } from 'react-redux';
import SelectMovies from '../../ui/selectMovies/SelectMovies';
import { selectQuery } from '../../../features/currentQuerySlice';

export default function MoviesListMain() {
  const location = useLocation();
  const dispatch = useDispatch();
  const currentQuery = useSelector((state) => state.currentQuery) || {};
  const { countries = '', order = 'NUM_VOTE', year = '', genreId = '' } = currentQuery;
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const movieType = MOVIE_LISTS.find((el) => el.url === location.pathname);

  console.log('MoviesListMain: Current query:', currentQuery);

  const queryParams = {
    type: movieType?.value || 'FILM',
    countries,
    order,
    year,
    genreId: movieType?.url === '/cartoons' && !genreId ? '18' : genreId,
    page,
  };

  const {
    data: filmsData,
    error: filmsError,
    isLoading: filmsIsLoading,
    refetch,
  } = useGetFilmsQuery(queryParams, { skip: !movieType });

  const { data: filtersData, error: filtersError, isLoading: filtersIsLoading } = useGetGenresAndCountriesQuery();

  useEffect(() => {
    console.log('MoviesListMain: Filters changed, refetching:', queryParams);
    refetch();
    setPage(1);
  }, [countries, order, year, genreId, location.pathname, refetch]);

  if (filmsError || filtersError) {
    console.log('MoviesListMain: Error:', filmsError || filtersError);
    return <ErrorMessage />;
  }
  if (filmsIsLoading || filtersIsLoading) {
    console.log('MoviesListMain: Loading...');
    return <MoviesListTopSkeleton />;
  }
  if (!movieType) {
    console.log('MoviesListMain: Movie type not found');
    return <ErrorMessage message="Страница не найдена" />;
  }

  return (
    <Box sx={{ px: isMobile ? 1 : 3, py: 2 }}>
      <Stack direction="row" alignItems="center" sx={{ mb: 2, mt: isMobile ? 0 : 2 }}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate(-1)}
          size={isMobile ? 'small' : 'medium'}
          sx={{ minWidth: 'auto', mr: 1 }}
        />
        <Typography 
          variant={isMobile ? 'h5' : 'h4'} 
          sx={{ fontWeight: 600 }}
        >
          {movieType.title}
        </Typography>
      </Stack>
      
      <Box sx={{ mb: 3 }}>
        <SelectMovies
          countriesList={filtersData?.countries || []}
          genresList={filtersData?.genres || []}
          countries={countries}
          order={order}
          year={year}
          genreId={genreId}
          isMobile={isMobile}
        />
      </Box>
      
      <MoviesList
        movies={filmsData?.items || []}
        totalPages={filmsData?.totalPages || 1}
        page={page}
        setPage={setPage}
        isMobile={isMobile}
      />
    </Box>
  );
}
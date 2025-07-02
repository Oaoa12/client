import { useGetFilmsQuery, useGetFilmsTopQuery } from '../services/kinopoiskApi';
import { TOP_LISTS } from '../constants';
import { useSelector } from 'react-redux';

const useMoviesQuery = () => {
  const currentQuery = useSelector((state) => state.currentQuery) || {
    page: 1,
    countries: '',
    order: 'NUM_VOTE',
    year: '',
    genreId: '',
  };
  const { page = 1, countries = '', order = 'NUM_VOTE', year = '', genreId = '' } = currentQuery;

  const responsePopular = useGetFilmsTopQuery(
    {
      type: TOP_LISTS[0]?.value || 'TOP_POPULAR_ALL',
      page,
    },
    { skip: !TOP_LISTS[0]?.value }
  );

  const responseBest = useGetFilmsTopQuery(
    {
      type: TOP_LISTS[1]?.value || 'TOP_250_MOVIES',
      page,
    },
    { skip: !TOP_LISTS[1]?.value }
  );

  const responseFilms = useGetFilmsQuery(
    {
      type: 'FILM',
      countries,
      genreId,
      order,
      year,
      page,
    },
    { skip: !page }
  );

  const responseSerials = useGetFilmsQuery(
    {
      type: 'TV_SERIES',
      countries,
      genreId,
      order,
      year,
      page,
    },
    { skip: !page }
  );

  const responseCartoons = useGetFilmsQuery(
    {
      type: 'FILM',
      countries,
      genreId: genreId || '18',
      order,
      year,
      page,
    },
    { skip: !page }
  );

  const isLoading =
    responsePopular.isFetching ||
    responseBest.isFetching ||
    responseFilms.isFetching ||
    responseSerials.isFetching ||
    responseCartoons.isFetching;

  const hasError =
    responsePopular.error ||
    responseBest.error ||
    responseFilms.error ||
    responseSerials.error ||
    responseCartoons.error;

  return {
    isLoading,
    hasError,
    responsePopular,
    responseBest,
    responseFilms,
    responseSerials,
    responseCartoons,
  };
};

export default useMoviesQuery;
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const kinopoiskApiKey = import.meta.env.VITE_KINOPOISK_KEY;

const excludeGenres = ['', 'новости', 'для взрослых', 'церемония', 'реальное ТВ', 'ток-шоу'];

export const kinopoiskApi = createApi({
  reducerPath: 'kinopoiskApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://kinopoiskapiunofficial.tech/api',
    prepareHeaders: (headers) => {
      headers.set('X-API-KEY', kinopoiskApiKey);
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getFilmsTop: builder.query({
      query: ({ type, page }) => `/v2.2/films/collections?type=${type}&page=${page}`,
    }),
    getFilms: builder.query({
      query: ({ countries = '', genreId = '', order = 'NUM_VOTE', type = 'FILM', year = '', page = 1, keyword = '' }) => {
        const params = new URLSearchParams({
          countries: countries || '',
          genres: genreId || '',
          order: order || 'NUM_VOTE',
          type: type || 'FILM',
          yearFrom: year || '',
          yearTo: year || '',
          page: page || 1,
          keyword: keyword || '',
        });
        return `/v2.2/films?${params.toString()}`;
      },
    }),
    getGenresAndCountries: builder.query({
      query: () => `/v2.2/films/filters`,
      transformResponse: (response) => ({
        ...response,
        genres: response.genres.filter(({ genre }) => !excludeGenres.includes(genre)),
      }),
    }),
    getFilm: builder.query({
      query: (id) => `/v2.2/films/${id}`,
    }),
    getSequelsAndPrequels: builder.query({
      query: (id) => `/v2.1/films/${id}/sequels_and_prequels`,
      transformResponse: (response) => response.map((el) => ({ ...el, kinopoiskId: el.filmId })),
    }),
    getStuff: builder.query({
      query: (id) => `/v1/staff?filmId=${id}`,
    }),
    getStaffById: builder.query({
      query: (id) => `/v1/staff/${id}`,
    }),
  }),
});

export const {
  useGetFilmsTopQuery,
  useGetFilmsQuery,
  useGetGenresAndCountriesQuery,
  useGetFilmQuery,
  useGetSequelsAndPrequelsQuery,
  useGetStuffQuery,
  useGetStaffByIdQuery,
} = kinopoiskApi;
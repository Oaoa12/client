import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const favoritesApi = createApi({
  reducerPath: 'favoritesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://server-ds6n.onrender.com/api/favorites',
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Favorites'],
  endpoints: (builder) => ({
    getFavorites: builder.query({
      query: () => '/',
      providesTags: ['Favorites'],
    }),
    addFavorite: builder.mutation({
      query: (kinopoiskId) => ({
        url: '/',
        method: 'POST',
        body: { kinopoiskId },
      }),
      invalidatesTags: ['Favorites'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          if (error.error?.status === 401) {
            try {
              const response = await fetch('https://server-ds6n.onrender.com/api/user/refresh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: localStorage.getItem('refreshToken') }),
              });
              const data = await response.json();
              if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                dispatch(favoritesApi.util.invalidateTags(['Favorites']));
              } else {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                dispatch(favoritesApi.util.resetApiState());
                window.location.href = '/login';
              }
            } catch (refreshError) {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              dispatch(favoritesApi.util.resetApiState());
              window.location.href = '/login';
            }
          }
        }
      },
    }),
    removeFavorite: builder.mutation({
      query: (kinopoiskId) => ({
        url: '/',
        method: 'DELETE',
        body: { kinopoiskId },
      }),
      invalidatesTags: ['Favorites'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          if (error.error?.status === 401) {
            try {
              const response = await fetch('https://server-ds6n.onrender.com/api/user/refresh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: localStorage.getItem('refreshToken') }),
              });
              const data = await response.json();
              if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                dispatch(favoritesApi.util.invalidateTags(['Favorites']));
              } else {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                dispatch(favoritesApi.util.resetApiState());
                window.location.href = '/login';
              }
            } catch (refreshError) {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              dispatch(favoritesApi.util.resetApiState());
              window.location.href = '/login';
            }
          }
        }
      },
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} = favoritesApi;
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const likesApi = createApi({
  reducerPath: 'likesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://server-ds6n.onrender.com/api/likes',
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getLikes: builder.query({
      query: (movieId) => `/${movieId}`,
      providesTags: ['Likes'],
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
        } catch (error) {
          if (error.error?.status === 401) await handleRefreshToken(dispatch);
        }
      },
    }),
    setLike: builder.mutation({
      query: (movieId) => ({
        url: '/like',
        method: 'POST',
        body: { movieId },
      }),
      invalidatesTags: ['Likes'],
    }),
    setDislike: builder.mutation({
      query: (movieId) => ({
        url: '/dislike',
        method: 'POST',
        body: { movieId },
      }),
      invalidatesTags: ['Likes'],
    }),
  }),
});

async function handleRefreshToken(dispatch) {
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
      dispatch(likesApi.util.invalidateTags(['Likes']));
    } else {
      logoutUser();
    }
  } catch (error) {
    logoutUser();
  }
}

function logoutUser() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.href = '/login';
}

export const { 
  useGetLikesQuery, 
  useSetLikeMutation, 
  useSetDislikeMutation 
} = likesApi;
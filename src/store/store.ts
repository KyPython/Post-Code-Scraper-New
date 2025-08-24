import { configureStore, createSlice, createApi, fetchBaseQuery } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { PostcodeData, ScrapingJob, DatabaseStats, ScrapingFormData, ApiResponse } from '../types/schema';
import { ScrapingStatus } from '../types/enums';
import { mockPostcodeData, mockScrapingJobs, mockDatabaseStats } from '../data/postcodeMockData';

// API slice
export const postcodeApi = createApi({
  reducerPath: 'postcodeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['PostcodeData', 'ScrapingJob', 'DatabaseStats'],
  endpoints: (builder) => ({
    getPostcodeData: builder.query<PostcodeData[], void>({
      query: () => 'api/postcode-data',
      transformResponse: (response: any) => {
        // Handle both direct array and wrapped response
        return Array.isArray(response) ? response : response.data || [];
      },
      providesTags: ['PostcodeData'],
    }),
    getScrapingJobs: builder.query<ScrapingJob[], void>({
      query: () => 'api/scraping-jobs',
      transformResponse: (response: any) => {
        return Array.isArray(response) ? response : response.data || [];
      },
      providesTags: ['ScrapingJob'],
    }),
    getDatabaseStats: builder.query<DatabaseStats, void>({
      query: () => 'api/database-stats',
      transformResponse: (response: any) => {
        return response.data || response;
      },
      providesTags: ['DatabaseStats'],
    }),
    startScrapingJob: builder.mutation<ApiResponse<ScrapingJob>, ScrapingFormData>({
      query: (formData) => ({
        url: 'api/start-scraping',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: any) => {
        return response;
      },
      invalidatesTags: ['ScrapingJob'],
    }),
    pauseScrapingJob: builder.mutation<ApiResponse<void>, string>({
      query: (jobId) => ({
        url: `api/pause-job/${jobId}`,
        method: 'POST',
      }),
      transformResponse: (response: any) => {
        return response;
      },
      invalidatesTags: ['ScrapingJob'],
    }),
    resumeScrapingJob: builder.mutation<ApiResponse<void>, string>({
      query: (jobId) => ({
        url: `api/resume-job/${jobId}`,
        method: 'POST',
      }),
      transformResponse: (response: any) => {
        return response;
      },
      invalidatesTags: ['ScrapingJob'],
    }),
    cancelScrapingJob: builder.mutation<ApiResponse<void>, string>({
      query: (jobId) => ({
        url: `api/cancel-job/${jobId}`,
        method: 'POST',
      }),
      transformResponse: (response: any) => {
        return response;
      },
      invalidatesTags: ['ScrapingJob'],
    }),
  }),
});

// App state slice
interface AppState {
  selectedJob: string | null;
  isScrapingFormOpen: boolean;
  notifications: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    timestamp: string;
  }>;
}

const initialState: AppState = {
  selectedJob: null,
  isScrapingFormOpen: false,
  notifications: []
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSelectedJob: (state, action: PayloadAction<string | null>) => {
      state.selectedJob = action.payload;
    },
    setScrapingFormOpen: (state, action: PayloadAction<boolean>) => {
      state.isScrapingFormOpen = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<AppState['notifications'][0], 'id' | 'timestamp'>>) => {
      const notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      };
      state.notifications.unshift(notification);
      // Keep only last 10 notifications
      if (state.notifications.length > 10) {
        state.notifications = state.notifications.slice(0, 10);
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    }
  }
});

export const { 
  setSelectedJob, 
  setScrapingFormOpen, 
  addNotification, 
  removeNotification, 
  clearNotifications 
} = appSlice.actions;

export const {
  useGetPostcodeDataQuery,
  useGetScrapingJobsQuery,
  useGetDatabaseStatsQuery,
  useStartScrapingJobMutation,
  usePauseScrapingJobMutation,
  useResumeScrapingJobMutation,
  useCancelScrapingJobMutation
} = postcodeApi;

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    [postcodeApi.reducerPath]: postcodeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(postcodeApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
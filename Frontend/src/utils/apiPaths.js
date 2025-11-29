export const API_BASE_URL = 'https://maopao.onrender.com';

export const API_PATHS = {
  AUTH: {
    LOGIN: '/api/v1/login',
    REGISTER: '/api/v1/register',
    GET_INFO_USER: '/api/v1/getUser',
  },

  CATMODEL: {
    GET_ALL: '/api/v1/cats',
    GET_BY_ID: (catId) => `/api/v1/cats/${catId}`,
    CREATE: '/api/v1/cats',
    UPDATE: (catId) => `/api/v1/cats/${catId}`,
    DELETE: (catId) => `/api/v1/cats/${catId}`,
    ADOPT: (catId) => `/api/v1/cats/${catId}/adopt`,
    MY_CATS: '/api/v1/cats/user/mycats',
  },

  ADOPTION: {
    CREATE_REQUEST: '/api/v1/adoption/request',
    GET_REQUESTS_FOR_OWNER: '/api/v1/adoption/owner/requests',
    APPROVE_ADOPTION: (catId) => `/api/v1/adoption/${catId}/approve`,
    REJECT_ADOPTION: (catId) => `/api/v1/adoption/${catId}/reject`,
    GET_MY_ADOPTION_REQUESTS: '/api/v1/adoption/myrequests',
    CANCEL_ADOPTION: (adoptionId) => `/api/v1/adoption/${adoptionId}/cancel`,
  },

  IMAGE: {
    CREATE_IMAGE: '/api/v1/images/upload',
    REMOVE_IMAGE: '/api/v1/images/removeimages',
  },
};

import axios from 'axios';
//use tanstack querycd
const DASHBOARD_API_URL = 'http://localhost:3010/dashboard/api/v1/dashboard';
const VIDEO_API_URL = 'http://localhost:3010/video/api/v1/video';
const AUTH_URL = 'http://localhost:3010/user/api/v1/user';
export const createCode = async (dashboardId: string) => {
  const response = await axios.post(`${DASHBOARD_API_URL}/create-code`, dashboardId, {
    withCredentials: true,
  });
  return response.data;
};
export const getPendingRequest = async (dashboardId: string) => {
  const response = await axios.get(`${DASHBOARD_API_URL}/pending-request`, {
    data: {
      dashboardId
    },
    withCredentials: true,
  });
  return response.data;
};
export const acceptRequest = async (requestId: string, pendingRequestuserId: string, dashboardId: string) => {
  const response = await axios.put(`${DASHBOARD_API_URL}/accept-request`, { requestId, pendingRequestuserId, dashboardId }, {
    withCredentials: true,
  });
  return response.data;
};
export const rejectRequest = async (requestId: string, dashboardId: string
) => {
  const response = await axios.put(`${DASHBOARD_API_URL}/reject-request`, { requestId, dashboardId }, {
    withCredentials: true,
  });
  return response.data;
}
export const fetchDashboard = async (dashboardId: string) => {
  const response = await axios.get(`${DASHBOARD_API_URL}/get`, {
    withCredentials: true,
  })
  return response.data;
}
export const newDashboard = async (DashboardName: string, userId: string) => {
  const response = await axios.post(`${DASHBOARD_API_URL}/new`, {
    DashboardName,
    ownerId: userId,
  }, {
    withCredentials: true,
  });
  return response.data;
}
export const join = async (code: string) => {
  const response = await axios.post(`${DASHBOARD_API_URL}/join`, {
    code
  }, {
    withCredentials: true,
  });
  return response.data;
}
export const VideoUploadEditor = async (formData: FormData) => {
  const response = await axios.post(
    `${VIDEO_API_URL}/upload-editor`,
    formData,
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  return response.data;
}
export const VideoUploadOwner = async (formData: FormData) => {
  const response = await axios.post(
    `${VIDEO_API_URL}/upload-owner`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
}
export const signin = async (email: string, password: string) => {
  const response = await axios.post(`${AUTH_URL}/signin`, {
    Email: email,
    Password: password,
  }, {
    withCredentials: true,
  });
  return response.data;
}
export const signup = async (email: string, password: string, name: string, ConfirmPassword: string) => {
  const response = await axios.post(`${AUTH_URL}/signup`, {
    Email: email,
    Password: password,
    ConfirmPassword,
    Name: name
  }, { withCredentials: true });
  return response.data;
}
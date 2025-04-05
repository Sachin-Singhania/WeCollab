import axios from 'axios';
const DASHBOARD_API_URL = 'http://localhost:3010/dashboard/api/v1/dashboard';
const VIDEO_API_URL = 'http://localhost:3010/video/api/v1/video';
const AUTH_URL = 'http://localhost:3010/user/api/v1/user';
export const createCode = async (dashboardId: string) => {
  try{
    const response = await axios.post(`${DASHBOARD_API_URL}/create-code`, {dashboardId}, {
      withCredentials: true,
    });
    return response.data;
  }catch(error:any){
    throw error;
  }

};
export const getPendingRequest = async (dashboardId: string) => {
  try{
    const response = await axios.get(`${DASHBOARD_API_URL}/pending-request`, {
      data: {
        dashboardId
      },
      withCredentials: true,
    });
    return response.data;
  }catch(error:any){
    throw error;
  }

};
export const acceptRequest = async (requestId: string, userId: string, dashboardId: string) => {
  try{
    const response = await axios.put(`${DASHBOARD_API_URL}/accept-request`, { requestId, userId, dashboardId }, {
      withCredentials: true,
    });
    return response.data;
  }catch(error:any){
    throw error;
  }

};
export const rejectRequest = async (requestId: string, dashboardId: string
) => {
  try{
    const response = await axios.put(`${DASHBOARD_API_URL}/reject-request`, { requestId, dashboardId }, {
      withCredentials: true,
    });
    return response.data;
  }catch(error:any){
    throw error;
  }
 
}
export const fetchDashboard = async () => {
  try{
    const response = await axios.get(`${DASHBOARD_API_URL}/get`, {
      withCredentials: true,
    })
    return response.data;
  }catch(error:any){
    throw error;
  }
 
}
export const newDashboard = async (name: string, userId: string) => {
  try{
    const response = await axios.post(`${DASHBOARD_API_URL}/new`, {
      name,
      ownerId: userId,
    }, {
      withCredentials: true,
    });
    return response.data;
  }catch(error:any){
    throw error;
  }
 
}
export const join = async (code: string) => {
  try{
    const response = await axios.post(`${DASHBOARD_API_URL}/join`, {
      code
    }, {
      withCredentials: true,
    });
    return response.data;
  }catch(error:any){
    throw error;
  }
 
}
export const VideoUploadEditor = async (formData: FormData) => {
  try{
    const response = await axios.post(
      `${VIDEO_API_URL}/upload-editor`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      }
    )
    return response.data;
  }catch(error:any){
    throw error;
  }
  
}
export const VideoUploadOwner = async (formData: FormData) => {
  try{
    const response = await axios.post(
      `${VIDEO_API_URL}/upload-owner`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials : true,
      }
    );
    return response.data;
  }catch(error:any){
    throw error;
  }
  
}
export const VideoUpload = async (videoId: string, dashboardId: string,title: string,description: string,privacyStatus: string) => {
  try{
    const response = await axios.post(`${VIDEO_API_URL}/youtube/upload`, {
      videoId,
      dashboardId,
      title,
      description,
      privacyStatus
      }, {
        withCredentials: true,
      });
      return response.data;
  }catch(error:any){
    throw error;
  }

}
export const signin = async (email: string, password: string) => {
  try{
    const response = await axios.post(`${AUTH_URL}/signin`, {
      Email: email,
      Password: password,
    }, {
      withCredentials: true,
    });
    return response.data;
  }catch(error:any){
    throw error;
  }

}
export const signup = async (email: string, name: string,password: string, ConfirmPassword: string) => {
  try{
    const response = await axios.post(`${AUTH_URL}/signup`, {
      Email: email,
      Password: password,
      ConfirmPassword,
      Name: name
    }, { withCredentials: true });
    return response.data;
  }catch(error:any){
    throw error;
  }
 
}
export const GetUserData= async()=> {
  try{
    const response= await axios.get('http://localhost:3010/user/api/v1/user/get',{
      withCredentials : true
    });
    return response.data;
  }catch(error:any){
    throw error;
  }
  
}
export const getVideo = async (dashboardId:string, lessonId: string) => {
  try{
    const response = await axios.get(`${VIDEO_API_URL}/${dashboardId}/${lessonId}`, {
      withCredentials: true,
    });
    return response.data;
  }catch(error:any){
    throw error;
  }
 
}
export const downloadVideo = async (dashboardId:string,videoId: string) => {
  try{
    const response = await axios.get(`${VIDEO_API_URL}/download/${dashboardId}/${videoId}`, {
      withCredentials: true,
      responseType: "blob",
    });
    return response;
  }catch(error:any){
    throw error;
  }
}
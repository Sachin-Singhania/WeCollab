export interface Join {
    code : string,
    userId:string
}
export interface Dashboard{
    name :string,
    ownerId:string,

}
export interface VideoRecived{
    name :string,
    description :string,
    dashboardId :string,
}
export interface ConvertToHLSResponse {
    success: boolean;
    message: string;
    videoUrl?: string;
    lessonId?: string;
  }
export const HttpStatusCode = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
  };
export type HttpStatusCode = keyof typeof HttpStatusCode;
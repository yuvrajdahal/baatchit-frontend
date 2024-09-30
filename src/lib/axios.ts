import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

export interface ApiError {
  status: number | null;
  message: string;
  data: any;
}

class Api {
  private axiosInstance: AxiosInstance;
  constructor(
    baseURL: string = (process.env.NODE_ENV=== "development"
      ? process.env.NEXT_PUBLIC_BACKEND_URL
      : process.env.NEXT_PUBLIC_PROD_BACKEND_URL) as string
  ) {
    this.axiosInstance = axios.create({
      baseURL: baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.axiosInstance.interceptors.request.use(
      (config) => this.handleRequest(config as InternalAxiosRequestConfig),
      (error) => this.handleError(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => this.handleResponse(response),
      (error) => Promise.reject(this.handleError(error))
    );
  }

  private handleRequest(
    config: InternalAxiosRequestConfig
  ): InternalAxiosRequestConfig {
    return config;
  }

  private handleResponse(response: AxiosResponse): AxiosResponse {
    return response;
  }

  private handleError(error: AxiosError): ApiError {
    const formattedError: ApiError = {
      status: error.response?.status ?? null,
      message: error.message || "An unknown error occurred",
      data: error.response?.data ?? null,
    };
    throw formattedError;
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async post<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default Api;

export async function asyncHandler<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    throw error as ApiError;
  }
}

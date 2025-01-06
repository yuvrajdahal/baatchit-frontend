import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { buildWebStorage, setupCache } from "axios-cache-interceptor";

export interface ApiError {
  status: number | null;
  message: string;
  data: any;
}

class Api {
  private axiosInstance: AxiosInstance;
  constructor(
    baseURL: string = (process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_BACKEND_URL
      : process.env.NEXT_PUBLIC_PROD_BACKEND_URL) as string
  ) {
    const defaultHeaders = {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    };

    this.axiosInstance = axios.create({
      baseURL: baseURL,
      headers: defaultHeaders,
      withCredentials: true,
    });
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        config.withCredentials = true;
        // Ensure cache headers are set for non-GET requests
        if (config.method !== "get") {
          //@ts-ignore
          config.headers = {
            ...config.headers,
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          };
        }
        return config;
      },
      (error) => this.handleError(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => this.handleResponse(response),
      (error) => Promise.reject(this.handleError(error))
    );
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
      const response = await this.axiosInstance.get<T>(url, {
        ...config,
        withCredentials: true,
      });
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
      const response = await this.axiosInstance.post<T>(url, data, {
        ...config,
        withCredentials: true,
        headers: {
          ...config?.headers,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.delete<T>(url, {
        ...config,
        withCredentials: true,
      });
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

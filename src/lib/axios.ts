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
    this.axiosInstance = setupCache(
      axios.create({
        baseURL: baseURL,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      {
        storage: buildWebStorage(localStorage, "axios-cache:"),
        ttl: 1000 * 60 * 5, // 5minute cache successfully response
        interpretHeader: true,
        methods: ["head", "get"],
        cacheTakeover: true,
        cachePredicate: {
          statusCheck: (status) =>
            [200, 203, 300, 301, 302, 404, 405, 410, 414, 501].includes(status),
        },
        etag: true,
        staleIfError: (error) => {
          if (axios.isAxiosError(error) && !error.response) {
            return 3600;
          }
          return false;
        },
      }
    );

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

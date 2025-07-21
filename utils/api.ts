import { BASE_URL } from './url';
import type {
  ApiResource,
  CreateResourcePayload,
  ItcaApiResponse,
  JeetixFileInfo,
  JeetixListResponse,
  JeetixResponse,
  ResourcesParams,
  ResourcesResponse,
  UpdateResourcePayload,
} from '@/types';

class ApiClient {
  private itcaBaseUrl = BASE_URL;
  private jeetixBaseUrl = 'https://jeetix-file-service.onrender.com/api/storage';

  /**============================================================
   * Fetches resources with optional filters and pagination
   * @param params - Search and filter parameters
   * @param token - Authentication token
   * @returns Promise with resources and pagination data
   ============================================================*/
  async getResources(
    params: ResourcesParams,
    token: string
  ): Promise<ItcaApiResponse<ResourcesResponse>> {
    const searchParams = new URLSearchParams();

    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.limit !== undefined) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.department && params.department !== 'all')
      searchParams.append('department', params.department);
    if (params.category && params.category !== 'all')
      searchParams.append('category', params.category);
    if (params.fileType && params.fileType !== 'all')
      searchParams.append('fileType', params.fileType);
    if (params.visibility && params.visibility !== 'all')
      searchParams.append('visibility', params.visibility);
    if (params.includeDeleted) searchParams.append('includeDeleted', 'true');

    const url = `${this.itcaBaseUrl}/resources?${searchParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch resources: ${response.statusText}`);
    }

    return response.json();
  }

  /**============================================================
   * Fetches a single resource by its ID
   * @param resourceId - The ID of the resource to fetch
   * @param token - Authentication token
   * @returns Promise with resource data
   ============================================================*/
  async getResource(
    resourceId: string,
    token: string
  ): Promise<ItcaApiResponse<{ resource: ApiResource }>> {
    const response = await fetch(`${this.itcaBaseUrl}/resources/${resourceId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch resource: ${response.statusText}`);
    }

    return response.json();
  }

  /**============================================================
   * Creates a new resource in the system
   * @param payload - Resource creation data
   * @param token - Authentication token
   * @returns Promise with created resource data
   ============================================================*/
  async createResource(
    payload: CreateResourcePayload,
    token: string
  ): Promise<ItcaApiResponse<{ resource: ApiResource }>> {
    const response = await fetch(`${this.itcaBaseUrl}/resources`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to create resource: ${response.statusText}`);
    }

    return response.json();
  }

  /**============================================================
   * Updates an existing resource
   * @param resourceId - The ID of the resource to update
   * @param payload - Resource update data
   * @param token - Authentication token
   * @returns Promise with updated resource data
   ============================================================*/
  async updateResource(
    resourceId: string,
    payload: UpdateResourcePayload,
    token: string
  ): Promise<ItcaApiResponse<{ resource: ApiResource }>> {
    const response = await fetch(`${this.itcaBaseUrl}/resources/${resourceId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to update resource: ${response.statusText}`);
    }

    return response.json();
  }

  /**============================================================
   * Tracks a resource view for analytics
   * @param resourceId - The ID of the resource being viewed
   * @param token - Authentication token
   ============================================================*/
  async trackResourceView(resourceId: string, token: string): Promise<void> {
    const response = await fetch(
      `${this.itcaBaseUrl}/resources/analytics/track-view/${resourceId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to track view: ${response.statusText}`);
    }
  }

  /**============================================================
   * Tracks a resource download for analytics
   * @param resourceId - The ID of the resource being downloaded
   * @param token - Authentication token
   ============================================================*/
  async trackResourceDownload(resourceId: string, token: string): Promise<void> {
    const response = await fetch(
      `${this.itcaBaseUrl}/resources/analytics/track-download/${resourceId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to track download: ${response.statusText}`);
    }
  }

  /**============================================================
   * Retrieves analytics data for a specific resource
   * @param resourceId - The ID of the resource
   * @param token - Authentication token
   * @returns Promise with analytics data
   ============================================================*/
  async getResourceAnalytics(
    resourceId: string,
    token: string
  ): Promise<
    ItcaApiResponse<{
      views: number;
      downloads: number;
      uniqueViewers: number;
      uniqueDownloaders: number;
      viewsByDay: Array<{ date: string; count: number }>;
      downloadsByDay: Array<{ date: string; count: number }>;
    }>
  > {
    const response = await fetch(`${this.itcaBaseUrl}/resources/analytics/${resourceId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get analytics: ${response.statusText}`);
    }

    return response.json();
  }

  /**============================================================
   * Moves a resource to the recycle bin (soft delete)
   * @param resourceId - The ID of the resource to delete
   * @param token - Authentication token
   * @returns Promise with updated resource data
   ============================================================*/
  async moveToRecycleBin(
    resourceId: string,
    token: string
  ): Promise<ItcaApiResponse<{ resource: ApiResource; action: string }>> {
    const response = await fetch(`${this.itcaBaseUrl}/resources/${resourceId}/trash-or-restore`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to move to recycle bin: ${response.statusText}`);
    }

    return response.json();
  }

  /**============================================================
   * Restores a resource from the recycle bin
   * @param resourceId - The ID of the resource to restore
   * @param token - Authentication token
   * @returns Promise with restored resource data
   ============================================================*/
  async restoreFromRecycleBin(
    resourceId: string,
    token: string
  ): Promise<ItcaApiResponse<{ resource: ApiResource; action: string }>> {
    const response = await fetch(`${this.itcaBaseUrl}/resources/${resourceId}/trash-or-restore`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to restore from recycle bin: ${response.statusText}`);
    }

    return response.json();
  }

  /**============================================================
   * Permanently deletes a resource from the system
   * @param resourceId - The ID of the resource to delete
   * @param token - Authentication token
   ============================================================*/
  async deleteResourcePermanently(resourceId: string, token: string): Promise<void> {
    const response = await fetch(`${this.itcaBaseUrl}/resources/${resourceId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete resource: ${response.statusText}`);
    }
  }

  /**============================================================
   * Retrieves file information from Jeetix storage
   * @param fileName - The name of the file to get info for
   * @returns Promise with file information or null if not found
   ============================================================*/
  async getJeetixFileInfo(fileName: string): Promise<JeetixFileInfo | null> {
    try {
      const response = await fetch(`${this.jeetixBaseUrl}/file/${encodeURIComponent(fileName)}`);

      if (!response.ok) {
        return null;
      }

      const data: JeetixFileInfo = await response.json();
      return data.status === 'success' ? data : null;
    } catch (error) {
      console.warn('Could not fetch Jeetix file info:', error);
      return null;
    }
  }

  /**============================================================
   * Retrieves a list of files from Jeetix storage
   * @param prefix - The folder prefix to search in
   * @returns Promise with array of file data
   ============================================================*/
  async getJeetixFileList(prefix = 'itca-resources'): Promise<JeetixListResponse['data']> {
    try {
      const response = await fetch(`${this.jeetixBaseUrl}/list?prefix=${prefix}`);

      if (!response.ok) {
        return [];
      }

      const data: JeetixListResponse = await response.json();
      return data.status === 'success' ? data.data : [];
    } catch (error) {
      console.warn('Could not fetch Jeetix file list:', error);
      return [];
    }
  }

  /**============================================================
   * Uploads a file to Jeetix storage
   * @param file - The file to upload
   * @param folder - The folder to upload to
   * @returns Promise with upload response data
   ============================================================*/
  async uploadToJeetix(file: File, folder = 'itca-resources'): Promise<JeetixResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch(`${this.jeetixBaseUrl}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.statusText}`);
    }

    const data: JeetixResponse = await response.json();

    if (data.status !== 'success') {
      throw new Error(data.status || 'File upload failed');
    }

    return data;
  }

  /**============================================================
   * Deletes a file from Jeetix storage
   * @param fileName - The name of the file to delete
   ============================================================*/
  async deleteFromJeetix(fileName: string): Promise<void> {
    try {
      const response = await fetch(`${this.jeetixBaseUrl}/delete/${encodeURIComponent(fileName)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        console.warn(`Failed to delete file from Jeetix: ${response.statusText}`);
      }
    } catch (error) {
      console.warn('Could not delete file from Jeetix:', error);
    }
  }
}

export const apiClient = new ApiClient();

export type { ResourcesParams, ResourcesResponse, ItcaApiResponse };

import {
  ApiResource,
  Resource,
  CreateResourcePayload,
  UpdateResourcePayload,
  JeetixFileItem,
} from '@/types';
import { BASE_URL } from './url';

export class ResourceAdapter {
  /**============================================================
   * Formats a file size in bytes into a human-readable string
   ============================================================*/
  static formatFileSize(sizeInBytes: number): string {
    if (!sizeInBytes) return 'Unknown';

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = sizeInBytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  /**============================================================
   * Determines the file type based on the file name extension
   ============================================================*/
  static getFileType(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || '';
  }

  /**============================================================
   * Formats a date string into YYYY-MM-DD format
   ============================================================*/
  static formatDate(dateString: string): string {
    return new Date(dateString).toISOString().split('T')[0];
  }

  /**===================================================================
   * Converts API resource to frontend Resource format with Jeetix data
   ===================================================================*/
  static fromApiResource(
    apiResource: ApiResource,
    jeetixData?: Record<string, JeetixFileItem>
  ): Resource {
    const primaryFileUrl = apiResource.fileUrls[0] || '';
    const fileName = primaryFileUrl.split('/').slice(-2).join('/');
    const fileType = this.getFileType(fileName);

    const fileNameOnly = fileName.includes('/') ? fileName.split('/').pop() : fileName;
    const jeetixFileData = jeetixData?.[fileNameOnly || ''];
    const fileSize = jeetixFileData?.metadata?.size
      ? this.formatFileSize(parseInt(jeetixFileData.metadata.size))
      : 'Unknown';

    return {
      resourceId: apiResource.resourceId,
      title: apiResource.title,
      description: apiResource.description,
      category: apiResource.category,
      downloads: apiResource.downloads,
      viewCount: apiResource.viewCount,
      fileUrls: apiResource.fileUrls,
      fileUrl: primaryFileUrl,
      fileName: fileName,
      type: fileType,
      fileSize: fileSize,
      visibility: apiResource.visibility,
      academicLevel: apiResource.academicLevel,
      department: apiResource.department,
      isDeleted: apiResource.isDeleted,
      deletedAt: apiResource.deletedAt,
      deletedBy: apiResource.deletedBy,
      createdBy: apiResource.createdBy,
      updatedBy: apiResource.updatedBy,
      createdAt: apiResource.createdAt,
      updatedAt: apiResource.updatedAt,
      dateUploaded: this.formatDate(apiResource.createdAt),
    };
  }

  /**============================================================
   * Converts API resource with async Jeetix metadata fetching
   ============================================================*/
  static async fromApiResourceWithJeetixMetadata(apiResource: ApiResource): Promise<Resource> {
    const primaryFileUrl = apiResource.fileUrls[0] || '';
    const fileName = primaryFileUrl.split('/').slice(-2).join('/');
    const fileType = this.getFileType(fileName);

    let fileSize = 'Unknown';
    try {
      const response = await fetch(`${BASE_URL}/storage/file/${encodeURIComponent(fileName)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success' && data.data.metadata?.size) {
          fileSize = this.formatFileSize(parseInt(data.data.metadata.size));
        }
      }
    } catch (error) {
      console.warn('Could not fetch file info from Jeetix:', error);
    }

    return {
      resourceId: apiResource.resourceId,
      title: apiResource.title,
      description: apiResource.description,
      category: apiResource.category,
      downloads: apiResource.downloads,
      viewCount: apiResource.viewCount,
      fileUrls: apiResource.fileUrls,
      fileUrl: primaryFileUrl,
      fileName: fileName,
      type: fileType,
      fileSize: fileSize,
      visibility: apiResource.visibility,
      academicLevel: apiResource.academicLevel,
      department: apiResource.department,
      isDeleted: apiResource.isDeleted,
      deletedAt: apiResource.deletedAt,
      deletedBy: apiResource.deletedBy,
      createdBy: apiResource.createdBy,
      updatedBy: apiResource.updatedBy,
      createdAt: apiResource.createdAt,
      updatedAt: apiResource.updatedAt,
      dateUploaded: this.formatDate(apiResource.createdAt),
    };
  }

  /**============================================================
   * Converts Resource to CreateResourcePayload for API
   ============================================================*/
  static toCreatePayload(resource: Partial<Resource>): CreateResourcePayload {
    return {
      title: resource.title!,
      description: resource.description!,
      category: resource.category!,
      fileUrls: resource.fileUrls!,
      visibility: resource.visibility!,
      academicLevel: resource.academicLevel!,
      department: resource.department!,
    };
  }

  /**============================================================
   * Converts Resource to UpdateResourcePayload for API
   ============================================================*/
  static toUpdatePayload(resource: Partial<Resource>): UpdateResourcePayload {
    const payload: UpdateResourcePayload = {};

    if (resource.title !== undefined) payload.title = resource.title;
    if (resource.description !== undefined) payload.description = resource.description;
    if (resource.category !== undefined) payload.category = resource.category;
    if (resource.fileUrls !== undefined) payload.fileUrls = resource.fileUrls;
    if (resource.visibility !== undefined) payload.visibility = resource.visibility;
    if (resource.academicLevel !== undefined) payload.academicLevel = resource.academicLevel;
    if (resource.department !== undefined) payload.department = resource.department;

    return payload;
  }
}

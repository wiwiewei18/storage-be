export interface FileUploadedIntegrationEvent {
  eventName: 'FileUploaded';
  payload: {
    fileId: string;
    objectKey: string;
    mimeType: string;
  };
  occurredAt: string;
}

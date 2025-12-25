export interface TextExtractedIntegrationEvent {
  eventName: 'TextExtracted';
  payload: {
    fileId: string;
    text: string;
    language: string;
  };
  occurredAt: string;
}

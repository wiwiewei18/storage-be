export interface UserSignedUpIntegrationEvent {
  eventName: 'UserSignedUp';
  payload: {
    userId: string;
    email: string;
  };
  occurredAt: string;
}

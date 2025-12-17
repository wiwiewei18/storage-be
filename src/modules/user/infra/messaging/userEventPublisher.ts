import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { UserSignedUp } from '@wiwiewei18/wilin-storage-domain';
import { UserSignedUpIntegrationEvent } from 'src/shared/events/userSignedUp.integration';

@Injectable()
export class UserEventPublisher {
  constructor(private readonly amqp: AmqpConnection) {}

  async publish(events: Array<any>) {
    for (const event of events) {
      if (event instanceof UserSignedUp) {
        const integrationEvent: UserSignedUpIntegrationEvent = {
          eventName: 'UserSignedUp',
          payload: {
            userId: event.userId,
            email: event.email,
          },
          occurredAt: event.occurredAt.toISOString(),
        };

        await this.amqp.publish(
          'user.exchange',
          'user.signed_up',
          integrationEvent,
        );
      }
    }
  }
}

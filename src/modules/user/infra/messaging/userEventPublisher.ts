import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { UserSignedUp } from '@wiwiewei18/wilin-storage-domain';

@Injectable()
export class UserEventPublisher {
  constructor(private readonly amqp: AmqpConnection) {}

  async publish(events: Array<any>) {
    for (const event of events) {
      if (event instanceof UserSignedUp) {
        await this.amqp.publish('user.exchange', 'user.signed_up', {
          eventName: 'UserSignedUp',
          payload: {
            userId: event.userId,
            email: event.email,
          },
          occurredAt: event.occurredAt.toISOString(),
        });
      }
    }
  }
}

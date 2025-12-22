import { Module } from '@nestjs/common';
import { RabbitMQModule as GoLevelUpRabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    GoLevelUpRabbitMQModule.forRoot({
      exchanges: [
        {
          name: 'user.exchange',
          type: 'topic',
        },
        {
          name: 'storage.exchange',
          type: 'topic',
        },
      ],
      uri: process.env.RABBITMQ_URI,
      connectionInitOptions: { wait: false },
    }),
  ],
  exports: [GoLevelUpRabbitMQModule],
})
export class RabbitMQModule {}

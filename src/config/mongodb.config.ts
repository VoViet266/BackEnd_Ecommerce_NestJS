import { ConfigModule, ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { Connection } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

export const MongooseConfigService = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const uri = configService.get<string>('MONGODB_URI');
    return {
      uri,
      autoCreate: true,
      autoIndex: true,
      connectionFactory: (connection: Connection) => {
        connection.plugin(softDeletePlugin);
        connection.on('connected', () => console.log('connected'));
        connection.on('open', () => console.log('open'));
        connection.on('disconnected', () => console.log('disconnected'));
        connection.on('reconnected', () => console.log('reconnected'));
        connection.on('disconnecting', () => console.log('disconnecting'));
        return connection;
      },
    };
  },
  inject: [ConfigService],
};

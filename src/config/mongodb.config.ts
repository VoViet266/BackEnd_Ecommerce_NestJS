import { ConfigModule, ConfigService } from '@nestjs/config';
import mongoose, { Connection } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

export const MongooseConfigService = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const uri = configService.get<string>('MONGODB_URI');
    return {
      uri,
      connectionFactory: (connection: Connection) => {
        console.log('Connection factory initialized');
        connection.plugin(softDeletePlugin);

        // Các sự kiện kết nối
        connection.once('open', () => console.log('✅ Connection open'));
        connection.on('connected', () => console.log('✅ Mongoose connected'));

        connection.on('disconnected', () =>
          console.log('⚠️ Mongoose disconnected'),
        );
        connection.on('reconnected', () =>
          console.log('✅ Mongoose reconnected'),
        );
        connection.on('disconnecting', () =>
          console.log('⚠️ Mongoose disconnecting'),
        );
        connection.on('error', (err) =>
          console.error('❌ Mongoose connection error:', err),
        );

        return connection;
      },
    };
  },
  inject: [ConfigService],
};

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
        console.log('Connection factory initialized');
        connection.plugin(softDeletePlugin);
        return connection;
      },
    };
  },
  inject: [ConfigService],
};

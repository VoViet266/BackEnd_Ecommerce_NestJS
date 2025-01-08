import { ConfigModule, ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

export const mongodbConfig = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get<string>('MONGODB_URI'),
    connectionFactory: (connection: mongoose.Connection) => {
      connection.plugin(softDeletePlugin);

      return connection;
    },
  }),
  inject: [ConfigService],
};

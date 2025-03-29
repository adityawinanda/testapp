import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ProfileModule } from './profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot("mongodb://dbmongo:27017/nest"),
    AuthModule,
    ProfileModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: function(configService: ConfigService) {
        return {
          secret: configService.get<string>("JWT_SECRET"),
          signOptions: {
            expiresIn: '1w',
          },
        }        
      },
      inject: [ConfigService]
    }),
    MongooseModule.forFeature([{
      name: User.name, schema: UserSchema
    }])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}

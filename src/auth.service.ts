import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import * as bcrypt from "bcryptjs";
import { JwtService } from '@nestjs/jwt';

export type JWTToken = string;

@Injectable()
export class AuthService {
  private missmatchErrorMessage = "Invalid Credentials";

  constructor(
    @InjectModel(User.name) private userCollection: Model<User>,
    private jwtService: JwtService
  ) {}

  async login(usernameOrEmail: string, password: string): Promise<JWTToken> {
    const user = await this.userCollection.findOne({
      $or: [
        { username: usernameOrEmail },
        { email: usernameOrEmail }
      ]
    }).exec();

    if (!user) {
      throw new HttpException(this.missmatchErrorMessage, HttpStatus.FORBIDDEN);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new HttpException(this.missmatchErrorMessage, HttpStatus.FORBIDDEN);
    }

    const payload = {sub: user._id, username: user.username};

    return this.jwtService.sign(payload);
  }

  async register(username: string, email: string, password: string): Promise<User> {
    const newUser = new this.userCollection({username, email, password});
    return newUser.save();
  }
}

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class Profile {
  @Prop({required: true})
  displayName: string;

  @Prop({required: true})
  gender: string;

  @Prop({required: true})
  birthDay: string;

  @Prop({required: true})
  horoscope: string;

  @Prop({required: true})
  zodiac: string;

  @Prop({required: true})
  height: number;

  @Prop({required: true})
  weight: number;

  @Prop({required: true})
  measurementUnit: string;

  @Prop({ type: Types.ObjectId, ref: "User", required: true, index: true})
  userId: Types.ObjectId;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);

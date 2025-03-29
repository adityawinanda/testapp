import { Prop,Schema, SchemaFactory } from "@nestjs/mongoose";
import * as bcrypt from "bcryptjs";

@Schema()
export class User {
  @Prop({required: true, unique: true})
  username: string;

  @Prop({required: true, unique: true})
  email: string;

  @Prop({required: true})
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

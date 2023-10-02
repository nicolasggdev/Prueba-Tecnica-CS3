import { Transform } from "class-transformer";
import { IsString, IsNotEmpty, MinLength } from "class-validator";

export class RegisterDto {
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  username: string;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  password: string;
}

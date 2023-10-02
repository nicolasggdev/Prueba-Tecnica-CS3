import { Transform } from "class-transformer";
import { IsString, IsNotEmpty, MinLength } from "class-validator";

export class LoginDto {
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

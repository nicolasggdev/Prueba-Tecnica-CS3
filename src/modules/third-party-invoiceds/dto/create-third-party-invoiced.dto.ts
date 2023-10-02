import { Transform } from "class-transformer";
import { IsString, IsNotEmpty, MinLength } from "class-validator";

export class CreateThirdPartyInvoicedDto {
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  name: string;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  address: string;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  phone: string;
}

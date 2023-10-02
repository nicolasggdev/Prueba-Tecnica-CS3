import { Transform } from "class-transformer";
import { IsString, IsPositive, IsInt, IsNumber, IsNotEmpty, MinLength, Min } from "class-validator";

export class CreateConceptDto {
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(0, { message: "unitPrice must be greater than 0" })
  unitPrice: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  quantity: number;
}

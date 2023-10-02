import { Transform } from "class-transformer";
import { PartialType } from "@nestjs/mapped-types";
import { CreateConceptDto } from "./create-concept.dto";
import { IsString, IsPositive, IsInt, IsNumber, IsOptional, MinLength, Min } from "class-validator";

export class UpdateConceptDto extends PartialType(CreateConceptDto) {
  @Transform(({ value }) => value.trim())
  @IsOptional()
  @IsString()
  @MinLength(1)
  description: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(0, { message: "unitPrice must be greater than 0" })
  unitPrice: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  quantity: number;
}

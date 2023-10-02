import { Transform } from "class-transformer";
import { PartialType } from "@nestjs/mapped-types";
import { IsString, MinLength, IsOptional } from "class-validator";
import { CreateThirdPartyInvoicedDto } from "./create-third-party-invoiced.dto";

export class UpdateThirdPartyInvoicedDto extends PartialType(CreateThirdPartyInvoicedDto) {
  @Transform(({ value }) => value.trim())
  @IsOptional()
  @IsString()
  @MinLength(1)
  name: string;

  @Transform(({ value }) => value.trim())
  @IsOptional()
  @IsString()
  @MinLength(1)
  address: string;

  @Transform(({ value }) => value.trim())
  @IsOptional()
  @IsString()
  @MinLength(10)
  phone: string;
}

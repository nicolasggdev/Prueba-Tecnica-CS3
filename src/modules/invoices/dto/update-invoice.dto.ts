import { Transform } from "class-transformer";
import { PartialType } from "@nestjs/mapped-types";
import { CreateInvoiceDto } from "./create-invoice.dto";
import { IsString, MinLength, IsOptional } from "class-validator";

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {
  @Transform(({ value }) => value.trim())
  @IsOptional()
  @IsString()
  @MinLength(1)
  number: string;
}

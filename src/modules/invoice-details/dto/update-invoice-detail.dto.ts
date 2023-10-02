import { PartialType } from "@nestjs/mapped-types";
import { IsNumber, IsOptional, IsPositive } from "class-validator";
import { CreateInvoiceDetailDto } from "./create-invoice-detail.dto";

export class UpdateInvoiceDetailDto extends PartialType(CreateInvoiceDetailDto) {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  quantity: number;
}

import { IsNumber, IsNotEmpty, IsPositive } from "class-validator";

export class CreateInvoiceDetailDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  invoiceId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  conceptId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;
}

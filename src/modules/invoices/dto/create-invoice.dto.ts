import { Transform, Type } from "class-transformer";
import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsNumber,
  Min,
  IsPositive,
  IsInt,
  IsArray,
  ArrayMinSize,
  ValidateNested
} from "class-validator";

class InvoiceDetail {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  conceptId: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @Min(0, { message: "quantity must be greater than 0" })
  quantity: number;
}

export class CreateInvoiceDto {
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  number: string;

  @IsNotEmpty()
  @IsString({
    message:
      "missionDate must be a datetime ('YYYY-MM-DDTHH:mm:ss'). Example: 2023-10-01T10:50:13.000Z"
  })
  missionDate: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  thirdPartyInvoicedId: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => InvoiceDetail)
  invoiceDetails: InvoiceDetail[];
}

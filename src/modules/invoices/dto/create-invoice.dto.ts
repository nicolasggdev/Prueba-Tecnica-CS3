import { Transform, Type } from "class-transformer";
import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsNumber,
  Min,
  IsPositive,
  IsDate,
  IsInt,
  IsArray,
  ArrayMinSize,
  ValidateNested
} from "class-validator";

function parseISODate(dateString: string): Date {
  return new Date(dateString.replace(/\.\d+Z$/, "Z"));
}

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

  @Transform(({ value }) => parseISODate(value))
  @IsNotEmpty()
  @IsDate({ message: "missionDate must be a datetime ('YYYY-MM-DDTHH:mm:ss')." })
  missionDate: Date;

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

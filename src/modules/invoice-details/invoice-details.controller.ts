import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { InvoiceDetailsService } from "./invoice-details.service";
import { PaginationQueryDto } from "src/utils/dto/pagination-query.dto";
import { CreateInvoiceDetailDto } from "./dto/create-invoice-detail.dto";
import { UpdateInvoiceDetailDto } from "./dto/update-invoice-detail.dto";
import { Controller, Get, Post, Body, Patch, Res, Delete, Req, Query, Param } from "@nestjs/common";

@ApiTags("invoice-details")
@ApiBearerAuth()
@Controller("invoice-details")
export class InvoiceDetailsController {
  constructor(private readonly invoiceDetailsService: InvoiceDetailsService) {}

  @Post()
  create(@Body() createInvoiceDetailDto: CreateInvoiceDetailDto, @Res() res) {
    return this.invoiceDetailsService.create(createInvoiceDetailDto, res);
  }

  @Get()
  findAll(@Query() pagination: PaginationQueryDto, @Res() res) {
    return this.invoiceDetailsService.findAll(pagination, res);
  }

  @Get(":id")
  findOne(@Param("id") id: number, @Res() res, @Req() req) {
    return this.invoiceDetailsService.findOne(res, req);
  }

  @Patch(":id")
  update(
    @Param("id") id: number,
    @Body() updateInvoiceDetailDto: UpdateInvoiceDetailDto,
    @Res() res,
    @Req() req
  ) {
    return this.invoiceDetailsService.update(updateInvoiceDetailDto, res, req);
  }

  @Delete(":id")
  remove(@Param("id") id: number, @Res() res, @Req() req) {
    return this.invoiceDetailsService.remove(res, req);
  }
}

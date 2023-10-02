import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { InvoicesService } from "./invoices.service";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { UpdateInvoiceDto } from "./dto/update-invoice.dto";
import { PaginationQueryDto } from "src/utils/dto/pagination-query.dto";
import { Controller, Get, Post, Body, Patch, Delete, Res, Req, Query, Param } from "@nestjs/common";

@ApiTags("invoices")
@ApiBearerAuth()
@Controller("invoices")
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  create(@Body() createInvoiceDto: CreateInvoiceDto, @Res() res, @Req() req) {
    return this.invoicesService.create(createInvoiceDto, res, req);
  }

  @Get()
  findAll(@Query() pagination: PaginationQueryDto, @Res() res) {
    return this.invoicesService.findAll(pagination, res);
  }

  @Get(":id")
  findOne(@Param("id") id: number, @Res() res, @Req() req) {
    return this.invoicesService.findOne(res, req);
  }

  @Patch(":id")
  update(
    @Param("id") id: number,
    @Res() res,
    @Req() req,
    @Body() updateInvoiceDto: UpdateInvoiceDto
  ) {
    return this.invoicesService.update(updateInvoiceDto, res, req);
  }

  @Delete(":id")
  remove(@Param("id") id: number, @Res() res, @Req() req) {
    return this.invoicesService.remove(res, req);
  }
}

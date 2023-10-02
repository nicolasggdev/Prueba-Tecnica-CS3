import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { PaginationQueryDto } from "src/utils/dto/pagination-query.dto";
import { ThirdPartyInvoicedsService } from "./third-party-invoiceds.service";
import { CreateThirdPartyInvoicedDto } from "./dto/create-third-party-invoiced.dto";
import { UpdateThirdPartyInvoicedDto } from "./dto/update-third-party-invoiced.dto";
import { Controller, Get, Post, Body, Patch, Delete, Res, Req, Query, Param } from "@nestjs/common";

@ApiTags("third-party-invoiceds")
@ApiBearerAuth()
@Controller("third-party-invoiceds")
export class ThirdPartyInvoicedsController {
  constructor(private readonly thirdPartyInvoicedsService: ThirdPartyInvoicedsService) {}

  @Post()
  create(@Body() createThirdPartyInvoicedDto: CreateThirdPartyInvoicedDto, @Res() res) {
    return this.thirdPartyInvoicedsService.create(createThirdPartyInvoicedDto, res);
  }

  @Get()
  findAll(@Query() pagination: PaginationQueryDto, @Res() res) {
    return this.thirdPartyInvoicedsService.findAll(pagination, res);
  }

  @Post("getAllWithInvoices")
  findAllWithInvoices(@Query() pagination: PaginationQueryDto, @Res() res) {
    return this.thirdPartyInvoicedsService.findAllWithInvoices(pagination, res);
  }

  @Get("/withInvoices/:id")
  findOneWithInvoices(@Param("id") id: number, @Res() res, @Req() req) {
    return this.thirdPartyInvoicedsService.findOneWithInvoices(res, req);
  }

  @Get(":id")
  findOne(@Param("id") id: number, @Res() res, @Req() req) {
    return this.thirdPartyInvoicedsService.findOne(res, req);
  }

  @Patch(":id")
  update(
    @Param("id") id: number,
    @Body() updateThirdPartyInvoicedDto: UpdateThirdPartyInvoicedDto,
    @Res() res,
    @Req() req
  ) {
    return this.thirdPartyInvoicedsService.update(updateThirdPartyInvoicedDto, res, req);
  }

  @Delete(":id")
  remove(@Param("id") id: number, @Res() res, @Req() req) {
    return this.thirdPartyInvoicedsService.remove(res, req);
  }
}

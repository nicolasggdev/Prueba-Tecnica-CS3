import { ConceptsService } from "./concepts.service";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { CreateConceptDto } from "./dto/create-concept.dto";
import { UpdateConceptDto } from "./dto/update-concept.dto";
import { PaginationQueryDto } from "src/utils/dto/pagination-query.dto";
import { Controller, Get, Post, Body, Patch, Delete, Res, Req, Query, Param } from "@nestjs/common";

@ApiTags("concepts")
@ApiBearerAuth()
@Controller("concepts")
export class ConceptsController {
  constructor(private readonly conceptsService: ConceptsService) {}

  @Post()
  create(@Body() createConceptDto: CreateConceptDto, @Res() res) {
    return this.conceptsService.create(createConceptDto, res);
  }

  @Get()
  findAll(@Query() pagination: PaginationQueryDto, @Res() res) {
    return this.conceptsService.findAll(pagination, res);
  }

  @Get(":id")
  findOne(@Param("id") id: number, @Res() res, @Req() req) {
    return this.conceptsService.findOne(res, req);
  }

  @Patch(":id")
  update(
    @Param("id") id: number,
    @Res() res,
    @Req() req,
    @Body() updateConceptDto: UpdateConceptDto
  ) {
    return this.conceptsService.update(updateConceptDto, res, req);
  }

  @Delete(":id")
  remove(@Param("id") id: number, @Res() res, @Req() req) {
    return this.conceptsService.remove(res, req);
  }
}

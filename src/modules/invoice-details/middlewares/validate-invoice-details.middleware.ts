import { Injectable, NestMiddleware, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NextFunction, Request, Response } from "express";
import { sendResponses } from "src/utils/services/sendResponse.services";
import { Repository } from "typeorm";
import { InvoiceDetail } from "../entities/invoice-detail.entity";

interface CustomRequest extends Request {
  invoiceDetail?: InvoiceDetail;
  invoiceDetailId?: number;
}

@Injectable()
export class ValidateInvoiceDetailsMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(InvoiceDetail)
    private readonly invoiceDetailRepository: Repository<InvoiceDetail>
  ) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    console.log("Searching for invoice detail by id");

    const { params } = req;

    const { id } = params;

    try {
      const findInvoiceDetailsById = await this.invoiceDetailRepository.findOne({
        where: { id: +id }
      });

      if (!findInvoiceDetailsById) {
        console.error("There's no invoice details in the database");

        return sendResponses(
          res,
          HttpStatus.NOT_FOUND,
          null,
          "There's no invoice details in the database"
        );
      }

      console.log("Invoice detail found! Next()");

      req.invoiceDetail = findInvoiceDetailsById;

      req.invoiceDetailId = +id;

      next();
    } catch (error) {
      return sendResponses(res, HttpStatus.INTERNAL_SERVER_ERROR, null, "Internal server error");
    }
  }
}

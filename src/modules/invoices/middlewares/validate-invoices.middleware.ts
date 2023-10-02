import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Invoice } from "../entities/invoice.entity";
import { sendResponses } from "src/utils/services/sendResponse.services";
import { NextFunction, Request, Response } from "express";
import { Injectable, NestMiddleware, HttpStatus } from "@nestjs/common";

interface CustomRequest extends Request {
  invoice?: Invoice;
  invoiceId?: number;
}

@Injectable()
export class ValidateInvoicesMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>
  ) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    console.log("Looking for invoice by id");

    const { params } = req;

    const { id } = params;

    try {
      const findInvoiceById = await this.invoiceRepository.findOne({
        where: { id: +id },
        relations: ["invoiceDetails"]
      });

      if (!findInvoiceById) {
        console.error("There's no invoice in the database");

        return sendResponses(res, HttpStatus.NOT_FOUND, null, "There's no invoice in the database");
      }

      console.log("Invoice found. Next()");

      req.invoice = findInvoiceById;

      req.invoiceId = +id;

      next();
    } catch (error) {
      console.log(error);

      return sendResponses(res, HttpStatus.INTERNAL_SERVER_ERROR, null, "Internal server error");
    }
  }
}

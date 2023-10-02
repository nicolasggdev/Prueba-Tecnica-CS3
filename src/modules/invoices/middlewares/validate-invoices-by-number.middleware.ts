import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Invoice } from "../entities/invoice.entity";
import { NextFunction, Request, Response } from "express";
import { Injectable, NestMiddleware, HttpStatus } from "@nestjs/common";
import { sendResponses } from "src/utils/services/sendResponse.services";

interface CustomRequest extends Request {
  invoice?: Invoice;
  invoiceId?: number;
  currentUser: any;
}

@Injectable()
export class ValidateInvoicesByNumberMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>
  ) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    console.log("Searching invoice by number");

    const { body, currentUser } = req;

    const { number } = body;

    const { id: userId } = currentUser;

    try {
      const findInvoice = await this.invoiceRepository.findOne({
        where: {
          number,
          userId
        }
      });

      if (findInvoice) {
        console.error("Invoice found in database");

        return sendResponses(
          res,
          HttpStatus.BAD_REQUEST,
          null,
          "The invoice is already in the database"
        );
      }

      console.log("No invoice found. Next()");

      next();
    } catch (error) {
      return sendResponses(res, HttpStatus.INTERNAL_SERVER_ERROR, null, "Internal server error");
    }
  }
}

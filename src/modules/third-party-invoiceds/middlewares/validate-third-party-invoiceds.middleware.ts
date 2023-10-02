import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { NextFunction, Request, Response } from "express";
import { Injectable, NestMiddleware, HttpStatus } from "@nestjs/common";
import { sendResponses } from "src/utils/services/sendResponse.services";
import { ThirdPartyInvoiced } from "../entities/third-party-invoiced.entity";

interface CustomRequest extends Request {
  thirdPartyInvoiced?: ThirdPartyInvoiced;
  thirdPartyInvoicedId?: number;
}

@Injectable()
export class ValidateThirdPartyInvoicedsMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(ThirdPartyInvoiced)
    private readonly thirdPartyInvoicedRepository: Repository<ThirdPartyInvoiced>
  ) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    console.log("Searching for third party billed by id");

    const { params } = req;

    const { id } = params;

    try {
      const findThirdPartyInvoicedById = await this.thirdPartyInvoicedRepository.findOne({
        where: { id: +id },
        relations: ["invoices", "invoices.invoiceDetails"]
      });

      if (!findThirdPartyInvoicedById) {
        console.error("There's no third party invoiced in the database");

        return sendResponses(
          res,
          HttpStatus.NOT_FOUND,
          null,
          "There's no third party invoiced in the database"
        );
      }

      console.log("Invoiced third party found. Next()");

      req.thirdPartyInvoiced = findThirdPartyInvoicedById;

      req.thirdPartyInvoicedId = +id;

      next();
    } catch (error) {
      return sendResponses(res, HttpStatus.INTERNAL_SERVER_ERROR, null, "Internal server error");
    }
  }
}

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
export class ValidateNameThirdPartyInvoicedsMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(ThirdPartyInvoiced)
    private readonly thirdPartyInvoicedRepository: Repository<ThirdPartyInvoiced>
  ) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    console.log("Searching for third party billed by name");

    const { body } = req;

    const { name } = body;

    try {
      let findThirdPartyInvoiced: any | undefined;

      if (name) {
        findThirdPartyInvoiced = await this.thirdPartyInvoicedRepository.findOneBy({ name });
      }

      if (findThirdPartyInvoiced) {
        console.error("The third party invoiced is already in the database");

        return sendResponses(
          res,
          HttpStatus.BAD_REQUEST,
          null,
          "The third party invoiced is already in the database"
        );
      }

      console.log("No billed third party found. Next()");

      next();
    } catch (error) {
      return sendResponses(res, HttpStatus.INTERNAL_SERVER_ERROR, null, "Internal server error");
    }
  }
}

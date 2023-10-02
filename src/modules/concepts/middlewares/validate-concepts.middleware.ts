import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Concept } from "../entities/concept.entity";
import { NextFunction, Request, Response } from "express";
import { Injectable, NestMiddleware, HttpStatus } from "@nestjs/common";
import { sendResponses } from "src/utils/services/sendResponse.services";

interface CustomRequest extends Request {
  concept?: Concept;
  conceptId?: number;
}

@Injectable()
export class ValidateConceptsMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(Concept)
    private readonly conceptRepository: Repository<Concept>
  ) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    const { params } = req;

    const { id } = params;

    try {
      console.log("Searching for concept by id");

      const findConceptById = await this.conceptRepository.findOne({
        where: { id: +id }
      });

      if (!findConceptById) {
        console.error("The requested concept was not found");

        return sendResponses(res, HttpStatus.NOT_FOUND, null, "There's no concept in the database");
      }

      console.log("Concept found! Next()");

      req.concept = findConceptById;

      req.conceptId = +id;

      next();
    } catch (error) {
      return sendResponses(res, HttpStatus.INTERNAL_SERVER_ERROR, null, "Internal server error");
    }
  }
}

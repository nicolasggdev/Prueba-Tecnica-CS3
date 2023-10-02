import { Repository } from "typeorm";
import { AppGateway } from "src/gateway/gateway";
import { InjectRepository } from "@nestjs/typeorm";
import { Concept } from "./entities/concept.entity";
import { Injectable, HttpStatus } from "@nestjs/common";
import { CreateConceptDto } from "./dto/create-concept.dto";
import { UpdateConceptDto } from "./dto/update-concept.dto";
import { PaginationQueryDto } from "src/utils/dto/pagination-query.dto";
import { sendResponses } from "src/utils/services/sendResponse.services";

@Injectable()
export class ConceptsService {
  constructor(
    @InjectRepository(Concept) private readonly conceptRepository: Repository<Concept>,
    private readonly appGateway: AppGateway
  ) {}

  async create(createConceptDto: CreateConceptDto, res: any) {
    console.log("Start concept creation");

    const newConcept = this.conceptRepository.create(createConceptDto);

    await this.conceptRepository.save(newConcept);

    console.log("Successful completion of concept creation");

    const notificationData = { message: "The concept was correctly created" };

    this.appGateway.sendNotificationToClients("concepts-notification", notificationData);

    return sendResponses(res, HttpStatus.CREATED, newConcept, "Information processed successfully");
  }

  async findAll({ limit, offset }: PaginationQueryDto, res: any) {
    console.log("Starts consultation of all concepts");

    const getAllConcepts = await this.conceptRepository.findAndCount({ skip: offset, take: limit });

    const [concepts, count] = getAllConcepts;

    if (!count) {
      console.error("No concepts created in the database");

      return sendResponses(res, HttpStatus.NOT_FOUND, null, "There're no concepts in the database");
    }

    console.log("Successfully completes the query of all concepts");

    const notificationData = { message: "All concepts were correctly listed" };

    this.appGateway.sendNotificationToClients("concepts-notification", notificationData);

    return sendResponses(res, HttpStatus.OK, concepts, "Information processed successfully");
  }

  async findOne(res: any, req: any) {
    console.log("Start concept query by id");

    const { concept } = req;

    console.log("Successful completion of concept query by id");

    const notificationData = { message: "The concept was correctly listed" };

    this.appGateway.sendNotificationToClients("concepts-notification", notificationData);

    return sendResponses(res, HttpStatus.OK, concept, "Information processed successfully");
  }

  async update(updateConceptDto: UpdateConceptDto, res: any, req: any) {
    console.log("Start of concept update");

    const { concept, conceptId: id } = req;

    if (!updateConceptDto || Object.keys(updateConceptDto).length === 0) {
      console.error("No data sent for update");

      return sendResponses(res, HttpStatus.BAD_REQUEST, null, "No update values provided");
    }

    const now: number = Date.now();

    const updatedAt: Date = new Date(now);

    const formattedUpdatedAt: string = updatedAt.toISOString().slice(0, 19).replace("T", " ");

    const updatedDto = {
      ...updateConceptDto,
      updatedAt: formattedUpdatedAt
    };

    await this.conceptRepository.update(id, updatedDto);

    const thirdPartyInvicedUptated = {
      ...concept,
      ...updateConceptDto
    };

    console.log("Successful completion of concept update");

    const notificationData = { message: "The concept was correctly updated" };

    this.appGateway.sendNotificationToClients("concepts-notification", notificationData);

    return sendResponses(
      res,
      HttpStatus.OK,
      thirdPartyInvicedUptated,
      "Information processed successfully"
    );
  }

  async remove(res: any, req: any) {
    console.log("Starts elimination of the concept");

    const { conceptId: id } = req;

    await this.conceptRepository.softDelete({ id });

    console.log("Successful completion of concept elimination");

    const notificationData = { message: "The concept was correctly deleted" };

    this.appGateway.sendNotificationToClients("concepts-notification", notificationData);

    return sendResponses(res, HttpStatus.OK, null, "Information processed successfully");
  }
}

import { Repository } from "typeorm";
import { AppGateway } from "src/gateway/gateway";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, HttpStatus } from "@nestjs/common";
import { PaginationQueryDto } from "src/utils/dto/pagination-query.dto";
import { sendResponses } from "src/utils/services/sendResponse.services";
import { ThirdPartyInvoiced } from "./entities/third-party-invoiced.entity";
import { CreateThirdPartyInvoicedDto } from "./dto/create-third-party-invoiced.dto";
import { UpdateThirdPartyInvoicedDto } from "./dto/update-third-party-invoiced.dto";

@Injectable()
export class ThirdPartyInvoicedsService {
  constructor(
    @InjectRepository(ThirdPartyInvoiced)
    private readonly thirdPartyInvoicedRepository: Repository<ThirdPartyInvoiced>,
    private readonly appGateway: AppGateway
  ) {}

  async create(createThirdPartyInvoicedDto: CreateThirdPartyInvoicedDto, res: any) {
    console.log("Creating billed third party");

    const newThirdPartyInvoiced = this.thirdPartyInvoicedRepository.create(
      createThirdPartyInvoicedDto
    );

    await this.thirdPartyInvoicedRepository.save(newThirdPartyInvoiced);

    console.log("Successfully completed creation of the billed third party");

    const notificationData = { message: "Correctly created the third party invoice" };

    this.appGateway.sendNotificationToClients(
      "third-party-invoiced-notification",
      notificationData
    );

    return sendResponses(
      res,
      HttpStatus.CREATED,
      newThirdPartyInvoiced,
      "Information processed successfully"
    );
  }

  async findAll({ limit, offset }: PaginationQueryDto, res: any) {
    console.log("Start search for all billed third parties");

    const getAllThirdPartyInvoiced = await this.thirdPartyInvoicedRepository.findAndCount({
      skip: offset,
      take: limit
    });

    const [thirdPartyInviced, count] = getAllThirdPartyInvoiced;

    if (!count) {
      console.error("There're no third party invoiced in the database");

      return sendResponses(
        res,
        HttpStatus.NOT_FOUND,
        null,
        "There're no third party invoiced in the database"
      );
    }

    console.log("Successfully completed search of all billed third parties");

    const notificationData = { message: "All invoiced third parties were correctly listed" };

    this.appGateway.sendNotificationToClients(
      "third-party-invoiced-notification",
      notificationData
    );

    return sendResponses(
      res,
      HttpStatus.OK,
      thirdPartyInviced,
      "Information processed successfully"
    );
  }

  async findAllWithInvoices({ limit, offset }: PaginationQueryDto, res: any) {
    console.log("Start search for all third parties with their invoices");

    const getAllThirdPartyInvoiced = await this.thirdPartyInvoicedRepository.findAndCount({
      relations: ["invoices", "invoices.invoiceDetails"],
      skip: offset,
      take: limit
    });

    const [thirdPartyInviced, count] = getAllThirdPartyInvoiced;

    if (!count) {
      console.error("There're no third party invoiced in the database");

      return sendResponses(
        res,
        HttpStatus.NOT_FOUND,
        null,
        "There're no third party invoiced in the database"
      );
    }

    console.log("Successfully finished searching for all third parties with their invoices");

    const notificationData = {
      message: "Correctly listed all invoiced third parties with their invoices"
    };

    this.appGateway.sendNotificationToClients(
      "third-party-invoiced-notification",
      notificationData
    );

    return sendResponses(
      res,
      HttpStatus.OK,
      thirdPartyInviced,
      "Information processed successfully"
    );
  }

  async findOne(res: any, req: any) {
    console.log("Start search for third party invoice by id");

    const { thirdPartyInvoiced } = req;

    delete thirdPartyInvoiced.invoices;

    console.log("Successfully finished searching for third party invoice by id");

    const notificationData = { message: "Correctly listed the billed third party" };

    this.appGateway.sendNotificationToClients(
      "third-party-invoiced-notification",
      notificationData
    );

    return sendResponses(
      res,
      HttpStatus.OK,
      thirdPartyInvoiced,
      "Information processed successfully"
    );
  }

  async findOneWithInvoices(res: any, req: any) {
    console.log("Start search for third party invoice by id with its invoices");

    const { thirdPartyInvoiced } = req;

    console.log("Successfully finished searching for third party invoice by id with its invoices");

    const notificationData = {
      message: "Correctly listed the invoiced third party with its invoices"
    };

    this.appGateway.sendNotificationToClients(
      "third-party-invoiced-notification",
      notificationData
    );

    return sendResponses(
      res,
      HttpStatus.OK,
      thirdPartyInvoiced,
      "Information processed successfully"
    );
  }

  async update(updateThirdPartyInvoicedDto: UpdateThirdPartyInvoicedDto, res: any, req: any) {
    console.log("Start update of billed third party");

    const { thirdPartyInvoiced, thirdPartyInvoicedId: id } = req;

    if (!updateThirdPartyInvoicedDto || Object.keys(updateThirdPartyInvoicedDto).length === 0) {
      console.error("No data sent for update");

      return sendResponses(res, HttpStatus.BAD_REQUEST, null, "No update values provided");
    }

    const now: number = Date.now();

    const updatedAt: Date = new Date(now);

    const formattedUpdatedAt: string = updatedAt.toISOString().slice(0, 19).replace("T", " ");

    const updatedDto = {
      ...updateThirdPartyInvoicedDto,
      updatedAt: formattedUpdatedAt
    };

    await this.thirdPartyInvoicedRepository.update(id, updatedDto);

    const thirdPartyInvicedUptated = {
      ...thirdPartyInvoiced,
      ...updateThirdPartyInvoicedDto
    };

    console.log("Third party billing update successfully completed");

    const notificationData = { message: "Correctly updated the third party invoice" };

    this.appGateway.sendNotificationToClients(
      "third-party-invoiced-notification",
      notificationData
    );

    return sendResponses(
      res,
      HttpStatus.OK,
      thirdPartyInvicedUptated,
      "Information processed successfully"
    );
  }

  async remove(res: any, req: any) {
    console.log("Start deletion of billed third party");

    const { thirdPartyInvoicedId: id } = req;

    await this.thirdPartyInvoicedRepository.softDelete({ id });

    console.log("Successfully completed removal of billed third party");

    const notificationData = { message: "Correctly deleted the third party invoice" };

    this.appGateway.sendNotificationToClients(
      "third-party-invoiced-notification",
      notificationData
    );

    return sendResponses(res, HttpStatus.OK, null, "Information processed successfully");
  }
}

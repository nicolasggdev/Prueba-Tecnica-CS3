import { Repository } from "typeorm";
import { AppGateway } from "src/gateway/gateway";
import { InjectRepository } from "@nestjs/typeorm";
import { InvoiceDetail } from "./entities/invoice-detail.entity";
import { Concept } from "src/modules/concepts/entities/concept.entity";
import { Invoice } from "src/modules/invoices/entities/invoice.entity";
import { PaginationQueryDto } from "src/utils/dto/pagination-query.dto";
import { InvoicesService } from "src/modules/invoices/invoices.service";
import { UpdateInvoiceDetailDto } from "./dto/update-invoice-detail.dto";
import { sendResponses } from "src/utils/services/sendResponse.services";
import { CreateInvoiceDetailDto } from "./dto/create-invoice-detail.dto";
import { forwardRef, Injectable, HttpStatus, Inject } from "@nestjs/common";

@Injectable()
export class InvoiceDetailsService {
  constructor(
    @InjectRepository(InvoiceDetail)
    private readonly invoiceDetailRepository: Repository<InvoiceDetail>,
    @InjectRepository(Concept)
    private readonly conceptRepository: Repository<Concept>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @Inject(forwardRef(() => InvoicesService))
    private invoiceService: InvoicesService,
    private readonly appGateway: AppGateway
  ) {}

  async create(createInvoiceDetailDto: CreateInvoiceDetailDto, res: any) {
    console.log("Creating invoice detail");

    const { conceptId, invoiceId, quantity } = createInvoiceDetailDto;

    const findConcept = await this.conceptRepository.findOneBy({ id: conceptId });

    if (!findConcept) {
      console.error("No concept was found for the detail provided.");

      return sendResponses(res, HttpStatus.NOT_FOUND, null, "There'is no concept in the database");
    }

    const findInvoice = await this.invoiceRepository.findOneBy({ id: invoiceId });

    if (!findInvoice) {
      console.error("No invoice was found for the detail provided.");

      return sendResponses(res, HttpStatus.NOT_FOUND, null, "There'is no invoice in the database");
    }

    if (quantity > findConcept.quantity) {
      console.error("Not enough units are available");

      return sendResponses(
        res,
        HttpStatus.BAD_REQUEST,
        null,
        `The product you are trying to add has only ${findConcept.quantity} units.`
      );
    }

    const invoiceDetailData: object = {
      invoiceId,
      conceptId,
      quantity
    };

    await this.invoiceDetailRepository.save(invoiceDetailData);

    const now: number = Date.now();

    const updatedAt: Date = new Date(now);

    const formattedUpdatedAt: string = updatedAt.toISOString().slice(0, 19).replace("T", " ");

    const updatedDto = {
      quantity: findConcept.quantity - quantity,
      updatedAt: formattedUpdatedAt
    };

    await this.conceptRepository.update(conceptId, updatedDto);

    const totalPrice = quantity * findConcept.unitPrice;

    const updateInvoice = {
      total: findInvoice.total + totalPrice,
      updatedAt: formattedUpdatedAt
    };

    await this.invoiceRepository.update(invoiceId, updateInvoice);

    console.log("Successfully completes the creation of the invoice detail.");

    const notificationData = { message: "Invoice detail was correctly created" };

    this.appGateway.sendNotificationToClients("invoice-details-notification", notificationData);

    return sendResponses(
      res,
      HttpStatus.OK,
      invoiceDetailData,
      "Information processed successfully"
    );
  }

  async findAll({ limit, offset }: PaginationQueryDto, res: any) {
    console.log("Starts search of all invoice details");

    const getAllInvoiceDetails = await this.invoiceDetailRepository.findAndCount({
      skip: offset,
      take: limit
    });

    const [invoiceDetails, count] = getAllInvoiceDetails;

    if (!count) {
      console.error("No invoice details created in the database");

      return sendResponses(
        res,
        HttpStatus.NOT_FOUND,
        null,
        "There're no invoice details in the database"
      );
    }

    console.log("Successfully completed search of all invoice details");

    const notificationData = { message: "All invoice details were correctly listed" };

    this.appGateway.sendNotificationToClients("invoice-details-notification", notificationData);

    return sendResponses(res, HttpStatus.OK, invoiceDetails, "Information processed successfully");
  }

  async findOne(res: any, req: any) {
    console.log("Start invoice detail search by id");

    const { invoiceDetail } = req;

    console.log("Successfully completed search for invoice detail by id");

    const notificationData = { message: "Correctly listed the invoice detail" };

    this.appGateway.sendNotificationToClients("invoice-details-notification", notificationData);

    return sendResponses(res, HttpStatus.OK, invoiceDetail, "Information processed successfully");
  }

  async update(updateInvoiceDetailDto: UpdateInvoiceDetailDto, res: any, req: any) {
    console.log("Start concept detail update");

    const { invoiceDetail, invoiceDetailId: id } = req;

    if (!updateInvoiceDetailDto || Object.keys(updateInvoiceDetailDto).length === 0) {
      console.error("No data sent for update");

      return sendResponses(res, HttpStatus.BAD_REQUEST, null, "No update values provided");
    }

    const { quantity } = updateInvoiceDetailDto;

    const { conceptId } = invoiceDetail;

    if (quantity > conceptId.quantity) {
      console.error("Not enough quantity in concepts");

      return sendResponses(res, HttpStatus.BAD_REQUEST, null, "Not enough quantity in concepts");
    }

    const diff = quantity - invoiceDetail.quantity;

    const conceptDiff = diff;

    const totalDiff = conceptDiff * conceptId.unitPrice;

    const now: number = Date.now();

    const updatedAt: Date = new Date(now);

    const formattedUpdatedAt: string = updatedAt.toISOString().slice(0, 19).replace("T", " ");

    const updatedDto = {
      quantity: quantity,
      updatedAt: formattedUpdatedAt
    };

    console.log("Updating concept detail");

    await this.invoiceDetailRepository.update(id, updatedDto);

    const updatedConceptDto = {
      quantity: conceptId.quantity - conceptDiff,
      updatedAt: formattedUpdatedAt
    };

    console.log("Updating concept");

    await this.conceptRepository.update(conceptId, updatedConceptDto);

    const updatedInvoiceDto = {
      total: invoiceDetail.invoiceId.total + totalDiff,
      updatedAt: formattedUpdatedAt
    };

    console.log("Updating invoices");

    await this.invoiceRepository.update(invoiceDetail.invoiceId.id, updatedInvoiceDto);

    console.log("Successful completion of concept detail update");

    const notificationData = { message: "The invoice detail was updated correctly" };

    this.appGateway.sendNotificationToClients("invoice-details-notification", notificationData);

    return sendResponses(res, HttpStatus.OK, null, "Information processed successfully");
  }

  async remove(res: any, req: any) {
    console.log("Starts deletion of invoice detail");

    const { invoiceDetail, invoiceDetailId: id } = req;

    const now: number = Date.now();

    const updatedAt: Date = new Date(now);

    const formattedUpdatedAt: string = updatedAt.toISOString().slice(0, 19).replace("T", " ");

    console.log("Replenishing units to the concept");

    const updatedConcept = {
      quantity: invoiceDetail.conceptId.quantity + invoiceDetail.quantity,
      updatedAt: formattedUpdatedAt
    };

    await this.conceptRepository.update(invoiceDetail.conceptId.id, updatedConcept);

    const totalPrice = invoiceDetail.quantity * invoiceDetail.conceptId.unitPrice;

    console.log("Adjusting total invoice value");

    const updatedInvoice = {
      total: invoiceDetail.invoiceId.total - totalPrice,
      updatedAt: formattedUpdatedAt
    };

    await this.invoiceRepository.update(invoiceDetail.invoiceId.id, updatedInvoice);

    await this.invoiceDetailRepository.softDelete({ id });

    console.log("Successful completion of invoice detail deletion");

    const notificationData = { message: "Invoice detail was deleted correctly" };

    this.appGateway.sendNotificationToClients("invoice-details-notification", notificationData);

    return sendResponses(res, HttpStatus.OK, null, "Information processed successfully");
  }
}

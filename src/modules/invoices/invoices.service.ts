import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Invoice } from "./entities/invoice.entity";
import { sendResponses } from "src/utils/services/sendResponse.services";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { UpdateInvoiceDto } from "./dto/update-invoice.dto";
import { UsersService } from "src/modules/users/users.service";
import { PaginationQueryDto } from "src/utils/dto/pagination-query.dto";
import { Concept } from "src/modules/concepts/entities/concept.entity";
import { Injectable, HttpStatus, Inject, forwardRef } from "@nestjs/common";
import { InvoiceDetail } from "src/modules/invoice-details/entities/invoice-detail.entity";
import { InvoiceDetailsService } from "src/modules/invoice-details/invoice-details.service";
import { ThirdPartyInvoiced } from "src/modules/third-party-invoiceds/entities/third-party-invoiced.entity";

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(ThirdPartyInvoiced)
    private readonly thirdPartyInvoicedRepository: Repository<ThirdPartyInvoiced>,
    @InjectRepository(Concept)
    private readonly conceptRepository: Repository<Concept>,
    @InjectRepository(InvoiceDetail)
    private readonly invoiceDetailRepository: Repository<InvoiceDetail>,
    @Inject(forwardRef(() => InvoiceDetailsService))
    private invoiceDetailService: InvoiceDetailsService,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto, res: any, req: any) {
    console.log("Start invoice creation");

    const { currentUser } = req;

    const { thirdPartyInvoicedId: id } = createInvoiceDto;

    const findThirdPartyInvoiced = await this.thirdPartyInvoicedRepository.findOneBy({ id });

    if (!findThirdPartyInvoiced) {
      console.error("The third party billed was not found in the database.");

      return sendResponses(
        res,
        HttpStatus.NOT_FOUND,
        null,
        "There's no third party invoiced in the database"
      );
    }

    console.log("Looking for the last invoice");

    const lastInvoice = await this.invoiceRepository.find({
      where: {
        userId: currentUser.id
      },
      order: {
        id: "DESC"
      },
      take: 1
    });

    if (lastInvoice.length !== 0) {
      const missionDateLastInvoice: string = new Date(lastInvoice[0].missionDate).toString();

      const currentMissionDate: string = new Date(createInvoiceDto.missionDate).toString();

      if (Date.parse(missionDateLastInvoice) > Date.parse(currentMissionDate)) {
        console.error("You cannot create backdated invoices");

        return sendResponses(
          res,
          HttpStatus.BAD_REQUEST,
          null,
          "You cannot create backdated invoices"
        );
      }
    }

    let total: number = 0;

    const invoiceDetails = [];

    for (let i = 0; i < createInvoiceDto.invoiceDetails.length; i++) {
      const { conceptId, quantity } = createInvoiceDto.invoiceDetails[i];

      const concept = await this.conceptRepository.findOne({
        where: {
          id: conceptId
        }
      });

      if (!concept || concept.quantity === 0 || quantity > concept.quantity) {
        console.error("Invalid concept");

        return sendResponses(
          res,
          HttpStatus.BAD_REQUEST,
          null,
          `Invalid concept with id ${conceptId}`
        );
      }

      const totalPrice = quantity * concept.unitPrice;

      total += totalPrice;

      const transformedInvoiceDetail = {
        conceptId,
        quantity
      };

      invoiceDetails.push(transformedInvoiceDetail);
    }

    const newInvoice = {
      ...createInvoiceDto,
      total,
      invoiceDetails,
      thirdPartyInvoicedId: findThirdPartyInvoiced,
      userId: currentUser
    };

    const invoiceCreated = await this.invoiceRepository.save(newInvoice);

    for (let j = 0; j < invoiceDetails.length; j++) {
      const { conceptId, quantity } = invoiceDetails[j];

      const invoiceDetailData = {
        invoiceId: invoiceCreated,
        conceptId,
        quantity
      };

      const data = this.invoiceDetailRepository.create(invoiceDetailData);

      await this.invoiceDetailRepository.save(data);

      const concept = await this.conceptRepository.findOne({
        where: {
          id: conceptId
        }
      });

      const now: number = Date.now();

      const updatedAt: Date = new Date(now);

      const formattedUpdatedAt: string = updatedAt.toISOString().slice(0, 19).replace("T", " ");

      const updatedDto = {
        quantity: concept.quantity - quantity,
        updatedAt: formattedUpdatedAt
      };

      await this.conceptRepository.update(conceptId, updatedDto);
    }

    console.log("Invoice creation successfully completed");

    return sendResponses(res, HttpStatus.CREATED, newInvoice, "Information processed successfully");
  }

  async findAll({ limit, offset }: PaginationQueryDto, res: any) {
    console.log("Start search for all invoices");

    const getAllInvoices = await this.invoiceRepository.findAndCount({ skip: offset, take: limit });

    const [invoices, count] = getAllInvoices;

    if (!count) {
      console.error("No invoices created in the database");

      return sendResponses(res, HttpStatus.NOT_FOUND, null, "There're no invoices in the database");
    }

    console.log("Successfully completed search of all invoices");

    return sendResponses(res, HttpStatus.OK, invoices, "Information processed successfully");
  }

  async findOne(res: any, req: any) {
    console.log("Start invoice search by id");

    const { invoice } = req;

    console.log("Invoice search by id successfully completed");

    return sendResponses(res, HttpStatus.OK, invoice, "Information processed successfully");
  }

  async update(updateInvoiceDto: UpdateInvoiceDto, res: any, req: any) {
    console.log("Start invoice update");

    const { invoice, invoiceId: id } = req;

    if (!updateInvoiceDto || Object.keys(updateInvoiceDto).length === 0) {
      console.error("No data sent for update");

      return sendResponses(res, HttpStatus.BAD_REQUEST, null, "No update values provided");
    }

    const now: number = Date.now();

    const updatedAt: Date = new Date(now);

    const formattedUpdatedAt: string = updatedAt.toISOString().slice(0, 19).replace("T", " ");

    const { number } = updateInvoiceDto;

    const updatedDto = {
      number,
      updatedAt: formattedUpdatedAt
    };

    await this.invoiceRepository.update(id, updatedDto);

    const invoiceUptated = {
      ...invoice,
      ...updateInvoiceDto
    };

    console.log("Invoice update successfully completed");

    return sendResponses(res, HttpStatus.OK, invoiceUptated, "Information processed successfully");
  }

  async remove(res: any, req: any) {
    console.log("Start invoice elimination");

    const { invoice, invoiceId: id } = req;

    const { invoiceDetails } = invoice;

    for (let i = 0; i < invoiceDetails.length; i++) {
      const { id: invoiceDetailId, conceptId, quantity } = invoiceDetails[i];

      const now: number = Date.now();

      const updatedAt: Date = new Date(now);

      const formattedUpdatedAt: string = updatedAt.toISOString().slice(0, 19).replace("T", " ");

      const updatedConcept = {
        quantity: conceptId.quantity + quantity,
        updatedAt: formattedUpdatedAt
      };

      await this.conceptRepository.update(conceptId.id, updatedConcept);

      await this.invoiceDetailRepository.softDelete({ id: invoiceDetailId });
    }

    await this.invoiceRepository.softDelete({ id });

    console.log("Successfully completed invoice deletion");

    return sendResponses(res, HttpStatus.OK, null, "Information processed successfully");
  }
}

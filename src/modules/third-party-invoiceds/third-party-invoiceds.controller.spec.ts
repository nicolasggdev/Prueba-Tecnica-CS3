import { Test, TestingModule } from "@nestjs/testing";
import { ThirdPartyInvoicedsService } from "./third-party-invoiceds.service";
import { ThirdPartyInvoicedsController } from "./third-party-invoiceds.controller";

describe("ThirdPartyInvoicedsController", () => {
  let controller: ThirdPartyInvoicedsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThirdPartyInvoicedsController],
      providers: [ThirdPartyInvoicedsService]
    }).compile();

    controller = module.get<ThirdPartyInvoicedsController>(ThirdPartyInvoicedsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});

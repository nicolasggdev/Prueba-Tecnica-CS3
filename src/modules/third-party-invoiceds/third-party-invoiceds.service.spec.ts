import { Test, TestingModule } from "@nestjs/testing";
import { ThirdPartyInvoicedsService } from "./third-party-invoiceds.service";

describe("ThirdPartyInvoicedsService", () => {
  let service: ThirdPartyInvoicedsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThirdPartyInvoicedsService]
    }).compile();

    service = module.get<ThirdPartyInvoicedsService>(ThirdPartyInvoicedsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from "@nestjs/testing";
import { InvoiceDetailsService } from "./invoice-details.service";
import { InvoiceDetailsController } from "./invoice-details.controller";

describe("InvoiceDetailsController", () => {
  let controller: InvoiceDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceDetailsController],
      providers: [InvoiceDetailsService]
    }).compile();

    controller = module.get<InvoiceDetailsController>(InvoiceDetailsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});

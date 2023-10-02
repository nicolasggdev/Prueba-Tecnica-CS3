import { InvoicesService } from "./invoices.service";
import { Test, TestingModule } from "@nestjs/testing";

describe("InvoicesService", () => {
  let service: InvoicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoicesService]
    }).compile();

    service = module.get<InvoicesService>(InvoicesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});

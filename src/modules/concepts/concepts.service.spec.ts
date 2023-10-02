import { ConceptsService } from "./concepts.service";
import { Test, TestingModule } from "@nestjs/testing";

describe("ConceptsService", () => {
  let service: ConceptsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConceptsService]
    }).compile();

    service = module.get<ConceptsService>(ConceptsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});

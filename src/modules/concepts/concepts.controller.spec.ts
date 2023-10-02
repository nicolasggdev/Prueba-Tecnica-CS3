import { ConceptsService } from "./concepts.service";
import { Test, TestingModule } from "@nestjs/testing";
import { ConceptsController } from "./concepts.controller";

describe("ConceptsController", () => {
  let controller: ConceptsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConceptsController],
      providers: [ConceptsService]
    }).compile();

    controller = module.get<ConceptsController>(ConceptsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});

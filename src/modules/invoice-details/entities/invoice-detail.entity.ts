import { Concept } from "src/modules/concepts/entities/concept.entity";
import { Invoice } from "src/modules/invoices/entities/invoice.entity";
import { Column, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class InvoiceDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt: Date;

  @ManyToOne(() => Invoice, (invoice) => invoice.invoiceDetails, {
    eager: true
  })
  invoiceId: Invoice;

  @ManyToOne(() => Concept, (concept) => concept.id, {
    eager: true
  })
  conceptId: Concept;
}

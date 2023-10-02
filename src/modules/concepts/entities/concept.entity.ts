import { InvoiceDetail } from "src/modules/invoice-details/entities/invoice-detail.entity";
import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Concept {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({ type: "double" })
  unitPrice: number;

  @Column()
  quantity: number;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt: Date;

  @OneToMany(() => InvoiceDetail, (invoiceDetail) => invoiceDetail.id)
  invoiceDetails: InvoiceDetail[];
}

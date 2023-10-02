import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "src/modules/users/entities/user.entity";
import { InvoiceDetail } from "src/modules/invoice-details/entities/invoice-detail.entity";
import { ThirdPartyInvoiced } from "src/modules/third-party-invoiceds/entities/third-party-invoiced.entity";

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: string;

  @Column({ type: "datetime" })
  missionDate: Date;

  @Column({ type: "double" })
  total: number;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt: Date;

  @ManyToOne(() => ThirdPartyInvoiced, (thirdPartyInvoiced) => thirdPartyInvoiced.invoices, {
    eager: true
  })
  thirdPartyInvoicedId: ThirdPartyInvoiced;

  @ManyToOne(() => User, (user) => user.id, {
    eager: true
  })
  userId: User;

  @OneToMany(() => InvoiceDetail, (invoiceDetail) => invoiceDetail.invoiceId)
  invoiceDetails: InvoiceDetail[];
}

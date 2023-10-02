import {
  BeforeUpdate,
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Invoice } from "src/modules/invoices/entities/invoice.entity";

@Entity()
export class ThirdPartyInvoiced {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @BeforeUpdate()
  updateTimestamps() {
    this.updatedAt = new Date();
  }

  @DeleteDateColumn({ select: false })
  deletedAt: Date;

  @OneToMany(() => Invoice, (invoice) => invoice.thirdPartyInvoicedId)
  invoices: Invoice[];
}

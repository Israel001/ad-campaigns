import { AutoMap } from "@automapper/classes";
import { BaseEntity } from "src/base/entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Image } from "../images/images.entity";

@Entity('campaigns', { synchronize: true })
export class Campaign extends BaseEntity {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column({ length: 50 })
  @AutoMap()
  name: string;

  @Column('datetime')
  @AutoMap()
  from: Date;

  @Column('datetime')
  @AutoMap()
  to: Date;

  @Column('float')
  @AutoMap()
  totalBudget: number;

  @Column('float')
  @AutoMap()
  dailyBudget: number;

  @OneToMany(() => Image, (image) => image.campaign, { lazy: true })
  images: Promise<Image[]>;
}
import { BaseEntity as TypeormBaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export class BaseEntity extends TypeormBaseEntity {
  @CreateDateColumn({
    type: 'datetime',
    precision: 0,
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    precision: 0,
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}

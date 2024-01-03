import {
    Entity,
    Column,
    OneToOne,
    UpdateDateColumn,
    BeforeInsert,
    JoinColumn,
    PrimaryColumn,
} from 'typeorm';

// Local files
import { UserEntity } from './user.entity';

@Entity('profiles')
export class ProfileEntity {
    constructor(partial: Partial<ProfileEntity>) {
        Object.assign(this, partial);
    }

    @PrimaryColumn({ type: 'bigint' })
    user_id: number;

    @Column({ type: 'string', length: 100 })
    fullname: string

    @Column({ type: 'bytea' })
    image: Buffer;

    @Column({ type: 'string', length: 250, nullable: true })
    address: string

    @UpdateDateColumn('date')
    updated_at: Date

    @BeforeInsert()
    async capFullName() {
        this.fullname = this.fullname.toUpperCase();
    }

    //--------------------  Relationship  -------------------- 

    @OneToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({ name: 'user_id' })
    userData: UserEntity;
}
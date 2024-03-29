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

	@Column({ type: 'varchar', length: 100 })
	fullname: string;

	@Column({ type: 'text', nullable: true })
	image_name: string;

	@Column({ type: 'int', nullable: true })
	image_size: number;

	@Column({ type: 'bytea', nullable: true })
	image_buffer: Buffer;

	@Column({ type: 'varchar', length: 250, nullable: true })
	address: string;

	@UpdateDateColumn({ type: 'timestamptz', precision: 3 })
	updated_at: Date;

	@BeforeInsert()
	async capFullName() {
		this.fullname = this.fullname.toUpperCase();
	}

	//--------------------  Relationship  --------------------

	@OneToOne(() => UserEntity, (user) => user.id)
	@JoinColumn({ name: 'user_id' })
	userData: UserEntity;
}

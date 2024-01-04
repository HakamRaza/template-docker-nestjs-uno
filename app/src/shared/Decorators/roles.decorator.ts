// Nest dependencies
import { SetMetadata } from '@nestjs/common';
import { ROLE } from '../Constant';
import { RolesEnum } from '../Enums/roles.enums';

export const Roles = (roles: RolesEnum) => SetMetadata(ROLE, roles);

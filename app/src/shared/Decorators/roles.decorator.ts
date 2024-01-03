// Nest dependencies
import { SetMetadata } from '@nestjs/common'
import { ROLES } from '../Constant'
import { RolesEnum } from '../Enums/roles.enums'

export const Roles = (roles: Array<RolesEnum>) => SetMetadata(ROLES, roles)

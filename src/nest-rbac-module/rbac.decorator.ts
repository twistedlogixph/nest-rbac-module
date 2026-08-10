import { SetMetadata } from '@nestjs/common';
import { RBAC_METADATA_KEY } from './constants';
import { RbacMetaData } from './interface';

export const Rbac = <T>(requirement: RbacMetaData<T> | boolean) => {
   return SetMetadata(RBAC_METADATA_KEY, requirement);
};

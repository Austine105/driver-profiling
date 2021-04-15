import { AssociationModel } from "./association.model";
import { ASSOCIATION_REPOSITORY } from "./constants";

export const AssociationProvider = [
  {
    provide: ASSOCIATION_REPOSITORY,
    useValue: AssociationModel,
  },
];

import { ContributionModel } from "./contribution.model";
import { CONTRIBUTION_REPOSITORY } from "./constants";

export const ContributionProvider = [
  {
    provide: CONTRIBUTION_REPOSITORY,
    useValue: ContributionModel,
  },
];

import { DRIVER_REPOSITORY } from "./constants";
import { DriverModel } from "./driver.model";

export const DriverProvider = [
  {
    provide: DRIVER_REPOSITORY,
    useValue: DriverModel,
  }
];

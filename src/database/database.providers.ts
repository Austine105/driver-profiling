import { Sequelize } from 'sequelize-typescript';
import { AssociationModel } from 'src/modules/association/association.model';
import { ContributionModel } from 'src/modules/contribution/contribution.model';
import { DriverModel } from 'src/modules/driver/driver.model';
import { WalletModel } from 'src/modules/wallet/wallet.model';
import { configService } from '../common/config/config.service';
import { SEQUELIZE } from '../common/constants';


export const databaseProviders = [
    {
        provide: SEQUELIZE,
        useFactory: async () => {
          const sequelize = new Sequelize(configService.getDatabaseUrl(), { ssl: true });
            sequelize.addModels([DriverModel, AssociationModel, ContributionModel, WalletModel]);
            await sequelize.sync();
            return sequelize;
        },
    },
];

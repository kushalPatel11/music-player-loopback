// import { injectable, BindingScope } from '@loopback/core';
// import { repository } from '@loopback/repository';
// import { UsersRepository, UserCredentialsRepository} from '../repositories';
// // import XlsxPopulate from 'xlsx-populate-types';
// import XlsxPopulate from 'xlsx-populate';
// import 'reflect-metadata';

// @injectable({ scope: BindingScope.TRANSIENT })
// export class Excel{
//   constructor(
//     @repository(UsersRepository)
//     public usersRepository: UsersRepository,
//     @repository(UserCredentialsRepository)
//     public userCredentialsRepository: UserCredentialsRepository,
//   ) {}

//     async convertInterfaceToExcel(schema:any,fileName:any){
//       const workbook = XlsxPopulate.fromBlankAsync();
//       const worksheet = (await workbook).sheet(0);
//       worksheet.name('test 1');

//       let colIndex = 1;
//       const propertyMetadata = Reflect.getMetadata('design:type', schema.prototype);
//       for (const propName in propertyMetadata) {
//         if (Object.prototype.hasOwnProperty.call(propertyMetadata, propName)) {
//           const dataType = propertyMetadata[propName].name;
//           worksheet.cell(1, colIndex).value(propName);
//           worksheet.column(colIndex).width(20);
//           worksheet.cell(2, colIndex).value(dataType);
//           worksheet.column(colIndex).width(20);
//           colIndex++;
//         }
//       }

//       (await workbook).toFileAsync(fileName);
//       console.log(`Excel file saved to ${fileName}`);
//     }
// }

// export interface User {
//   id: number;
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   createdAt: Date;
//   updatedAt: Date;
// }



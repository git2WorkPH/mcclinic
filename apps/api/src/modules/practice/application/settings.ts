import { AppError } from '../../../application/context.js';
export interface Branding {systemName:string;address:string;phone:string;email:string;logo:string;color:string}
export const colors=['#17675a','#194d80','#653f78'];
export function branding(value:Branding) {
 for(const key of ['systemName','address','phone','email'] as const)if(typeof value[key]!=='string'||value[key].length>500)throw new AppError('VALIDATION','Invalid clinic details.');
 if(!value.systemName.trim()||!colors.includes(value.color))throw new AppError('VALIDATION','Choose a system name and supported accessible color.');
 if(typeof value.logo!=='string'||value.logo.length>140000||value.logo&&!/^data:image\/(png|jpeg);base64,[A-Za-z0-9+/]+={0,2}$/.test(value.logo))throw new AppError('VALIDATION','Logo must be a PNG/JPEG data URL smaller than 100 KB.');
 return value;
}

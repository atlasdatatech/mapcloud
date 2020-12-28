import {isArray} from './util';

export function getFilterValue(filter) {
    let value = null;
   if(isArray(filter)){
       switch(filter[0]) {
           case 'has':
           case '!has':
               value = null;
               break;
           case 'in':
           case '!in':
               value = filter.slice(2);
               break;
           case '!=':
           case '==':
           case '>':
           case '>=':
           case '<':
           case '<=':
               value = filter[2];
               break;
       }
   }
   return value;
}
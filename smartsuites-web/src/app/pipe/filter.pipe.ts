import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value:any[], filter:object) {

    if(!filter) return value;

    if(typeof filter !== 'object') {
      throw new Error('Invalid pipe argument for filter');
    }

    return value.filter(function(item, index, array) {
      for (let key in filter) {
        if(filter[key] == '')
          continue
        if (!item[key] === filter[key])
          return false
      }
      return true
    })
  }

}

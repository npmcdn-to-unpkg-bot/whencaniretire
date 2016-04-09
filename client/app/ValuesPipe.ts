import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({name: 'values'})
export class ValuesPipe implements PipeTransform {

  public transform(values: any, args?: any[]): Object[] {

    if(values === undefined) return undefined;
    if(values == null) return null;

    return Object.keys(values).map(k => {
      return {
        key: k,
        value: values[k]
      };
    });

  }
}

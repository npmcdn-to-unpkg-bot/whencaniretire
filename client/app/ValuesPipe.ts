import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({name: 'values'})
export class ValuesPipe implements PipeTransform {

  transform(values: any, args?: any[]): Object[] {
    let keys: string[] = Object.keys(values);
    let data: any[] = [];
    let keyName: string = "_id";
    if(args.length > 0 && args[0].length > 0 && args[0] != null) keyName = args[0];

    /*let x = keys.map(key => {
      console.log(value[key]);
      value[key][keyName] = key;
      return value;
      //data.push(value[key])
    });

    console.log(x);

    return x;

    //return data;
    */
    return keys.map(k => {
      return {
        index: k,
        value: values[k]
      }
    });



  }
}

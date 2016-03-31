import {Injectable} from "angular2/core";


@Injectable()
export class UuidService {

  getDate: Function;

  constructor(){
    if(window.performance && typeof window.performance.now === "function"){
      this.getDate = this.getDateWithPerformance;
    }
    else {
      this.getDate = this.getDateWithoutPerformance;
    }
  }

  public get(): string {
    let d = this.getDate();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == "x" ? r : (r&0x3|0x8)).toString(16);
    });
  }

  public getDateWithoutPerformance(): number {
    console.log("base");
    return new Date().getTime();
  }

  public getDateWithPerformance(): number {
    console.log("performance");
    return this.getDateWithoutPerformance() + performance.now();
  }


};

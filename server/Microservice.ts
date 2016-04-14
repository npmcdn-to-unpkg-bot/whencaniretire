import {RouterManager} from "./ApiManager";

export interface MicroserviceRoute {

  route: any[];
  method: string;
  impl: Function;
};


export abstract class Microservice {

  protected routeData: MicroserviceRoute[];
  protected routerManager: RouterManager;

  constructor(rm: RouterManager) {

    this.routerManager = rm;

  }


  protected registerRoutes(): void {

    this.routeData.forEach(r => {
      let rt = {
        route: r.route,
      };
      rt[r.method] = r.impl.bind(this);

      this.routerManager.registerRoute(rt);
    });

  }
};


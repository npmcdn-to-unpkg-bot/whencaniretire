System.config({
  paths: {
    "app/*": "assets/js/client/app/*.js",
    "*": "*.js"
  }
  /*packages: {
    "assets/js/client/app/main": {
      format: "register",
      defaultExtension: "js"
    },
    "assets/js/client/app/app.component": {
      format: "register",
      defaultExtension: "js"
    }
  }*/
});

System.import("app/main").then(null, console.error.bind(console));

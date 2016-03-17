System.config({
  "packages": {
    "app": {
      "defaultExtension": "js"
    },
    "angular2-modal": {
      "defaultExtension": "js",
      "main": "index.js"
    }
  },
  "map": {
    "app": "assets/js/client/app",
    "angular2-modal": "assets/js/lib/angular2-modal"
  }
});

System.import("app/main").then(null, console.error.bind(console));

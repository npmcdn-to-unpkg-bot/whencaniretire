System.config({
  "packages": {
    "app": {
      "defaultExtension": "js"
    }
  },
  "map": {
    "app": "assets/js/client/app"
  }
});

System.import("app/main").then(null, console.error.bind(console));

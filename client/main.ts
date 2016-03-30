System.config({
  "packages": {
    "app": {
      "defaultExtension": "js"
    },
    "falcor": {
      "main": "falcor.browser.min.js"
    }
  },
  "map": {
    "app": "assets/js/client/app",
    "falcor": "https://cdnjs.cloudflare.com/ajax/libs/falcor/0.1.15/"
  }
});

System.import("app/main").then(null, console.error.bind(console));

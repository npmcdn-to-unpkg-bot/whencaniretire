import {Gulpclass, SequenceTask, Task} from "gulpclass/Decorators";
import * as gulp from "gulp";
import * as del from "del";
import * as path from "path";
import * as ts from "gulp-typescript";
import * as nodemon from "gulp-nodemon";
import * as sass from "gulp-sass";
import * as flatten from "gulp-flatten";


@Gulpclass()
export class Gulpfile {


  static getSrc(cfg: any): string[] {
    return cfg.src.map((val, idx, thisArg): string => {
      return path.resolve(cfg.baseDir, val);
    });
  }

  static getWatcher(cfg: any): any {
    return gulp.watch(Gulpfile.getSrc(cfg), cfg.watchTasks);
  }

  static config = {
    server: {
      baseDir: "./server",
      src: [
        "src/**/*.ts",
        "../build-tools/server/typings/main.d.ts"
      ],
      dest: "",
      watchTasks: ["buildServer"]
    },
    client: {
      baseDir: "./client",
      src: [
        "src/**/*.ts",
        "../build-tools/client/typings/browser.d.ts"
      ],
      dest: "assets/js/client",
      watchTasks: ["buildClient"]
    },
    angular2Modal: {
      baseDir: "./",
      src: [
        "node_modules/angular2-modal/src/components/angular2-modal/**/*.ts",
        "build-tools/typings/browser.d.ts"
      ],
      dest: "assets/js/lib/angular2-modal",
      watchTasks: []
    },
    html: {
      baseDir: "./html",
      src: ["**/*.jade"],
      dest: "views",
      watchTasks: ["buildHtml"]
    },
    css: {
      baseDir: "assets/css",
      src: ["**/*.scss"],
      dest: "assets/css",
      watchTasks: ["buildCss"]
    }
  };

  @Task("run", ["app", "watch"])
  run(){
  }

  @Task("app", ["buildServer", "buildHtml", "buildClient", "buildAngular2Modal", "buildCss"])
  app(){
    let nodemonSettings = {
      execMap: {
        js: "node --harmony-destructuring --harmony_rest_parameters"
      },
      script: path.resolve("./dist/app.js"),
      watch: path.resolve("./dist"),
      ext: "js jade"
    };

    return nodemon(nodemonSettings).on("restart", ()=> {
      console.log("Restarted!");
    });
  }

  @SequenceTask("runClean")
  runClean(){
    return ["clean", "run"];
  }

  @Task("clean")
  clean(){
    return del(path.resolve("./dist/**"));
  }

  @Task("build", ["buildServer", "buildHtml", "buildClient", "buildCss"])
  build(){
    return;
  }

  @Task("watch", ["watchServer", "watchHtml", "watchClient", "watchCss"])
  watch(){
    return;
  }

  static getSrc(cfg): string[] {
    return cfg.src.map((val, idx, thisArg): string => {
      return path.resolve(cfg.baseDir, val);
    });
  }

  @Task("watchServer")
  watchServer(){
    return Gulpfile.getWatcher(Gulpfile.config.server);
  }

  @Task("watchClient")
  watchClient(){
    return Gulpfile.getWatcher(Gulpfile.config.client);
  }

  @Task("watchHtml")
  watchHtml(){
    return Gulpfile.getWatcher(Gulpfile.config.html);
  }

  @Task("watchCss")
  watchCss(){
    return Gulpfile.getWatcher(Gulpfile.config.css);
  }

  @Task("buildServer")
  buildServer(){
    let tsProject = ts.createProject(path.resolve("./build-tools/server-tsconfig.json"));

    return gulp
      .src(Gulpfile.getSrc(Gulpfile.config.server))
      .pipe(ts(tsProject))
      .js
      .pipe(gulp.dest(path.resolve("./dist", Gulpfile.config.server.dest)));
  }

  @Task("buildClient")
  buildClient(){
    let tsProject = ts.createProject(path.resolve("./build-tools/client-tsconfig.json"));

    return gulp
      .src(Gulpfile.getSrc(Gulpfile.config.client))
      .pipe(ts(tsProject))
      .js
      .pipe(gulp.dest(path.resolve("./dist", Gulpfile.config.client.dest)));
  }

  @Task("buildAngular2Modal")
  buildAnguarModal(){
    let tsProject = ts.createProject(path.resolve("./build-tools/client-tsconfig.json"));

    return gulp
      .src(Gulpfile.getSrc(Gulpfile.config.angular2Modal))
      .pipe(ts(tsProject))
      .js
      .pipe(gulp.dest(path.resolve("./dist", Gulpfile.config.angular2Modal.dest)));
  }


  @Task("buildHtml")
  buildHtml(){
    return gulp
      .src(Gulpfile.getSrc(Gulpfile.config.html))
      .pipe(gulp.dest(path.resolve("./dist", Gulpfile.config.html.dest)));
  }

  @Task("buildCss")
  buildCss(){
    return gulp
      .src(Gulpfile.getSrc(Gulpfile.config.css))
      .pipe(sass())
      .pipe(gulp.dest(path.resolve("./dist", Gulpfile.config.css.dest)));
  }

  @SequenceTask()
  default(){
    return ["buildClean"];
  }

}


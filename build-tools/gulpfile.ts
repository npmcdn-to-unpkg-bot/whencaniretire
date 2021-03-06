import {Gulpclass, SequenceTask, Task} from "gulpclass/Decorators";
import * as gulp from "gulp";
import * as del from "del";
import * as path from "path";
import * as ts from "gulp-typescript";
import * as nodemon from "gulp-nodemon";
import * as sass from "gulp-sass";
import * as gulpTypings from "gulp-typings";

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
        "**/*.ts",
        "../build-tools/server/typings/main.d.ts"
      ],
      dest: "",
      watchTasks: ["buildServer"]
    },
    client: {
      baseDir: "./client",
      src: [
        "**/*.ts",
        "../build-tools/client/typings/browser.d.ts"
      ],
      dest: "assets/js/client",
      watchTasks: ["buildClient"]
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

  //@Task("app", ["buildServer", "buildHtml", "buildClient", "buildAngular2Modal", "buildCss"])
  @Task("app", ["buildServer", "buildHtml", "buildClient", "buildCss"])
  app(){
    let nodemonSettings = {
      execMap: {
        js: "node --harmony-destructuring --harmony_rest_parameters"
      },
      script: path.resolve("./dist/app.js"),
      watch: path.resolve("./dist"),
      ext: "js jade",
      delay: 2
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
    let tsProject = ts.createProject(path.resolve("./build-tools/server/tsconfig.json"));

    return gulp
      .src(Gulpfile.getSrc(Gulpfile.config.server))
      .pipe(ts(tsProject))
      .js
      .pipe(gulp.dest(path.resolve("./dist", Gulpfile.config.server.dest)));
  }

  @Task("buildClient")
  buildClient(){
    let tsProject = ts.createProject(path.resolve("./build-tools/client/tsconfig.json"));

    return gulp
      .src(Gulpfile.getSrc(Gulpfile.config.client))
      .pipe(ts(tsProject))
      .js
      .pipe(gulp.dest(path.resolve("./dist", Gulpfile.config.client.dest)));
  }

  @Task("buildAngular2Modal")
  buildAnguarModal(){
    let tsProject = ts.createProject(path.resolve("./build-tools/client/tsconfig.json"));

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

  //@Task("installTypings", ["installClientTypings", "installServerTypings", "installAngular2ModalTypings"])
  @Task("installTypings", ["installClientTypings", "installServerTypings"])
  installTypings(){
    return;
  }

  @Task("installClientTypings")
  installClientTypings(){
    return gulp
      .src("./build-tools/client/typings.json")
      .pipe(gulpTypings());
  }

  @Task("installServerTypings")
  installServerTypings(){
    return gulp
      .src("./build-tools/server/typings.json")
      .pipe(gulpTypings());
  }

  @Task("installAngular2ModalTypings")
  installAngular2ModalTypings(){
    return gulp
      .src("./build-tools/angular2Modal/typings.json")
      .pipe(gulpTypings());

  @SequenceTask()
  default(){
    return ["buildClean"];
  }

}


import {Gulpclass, SequenceTask, Task} from "gulpclass/Decorators";
import * as gulp from "gulp";
import * as del from "del";
import * as path from "path";
import * as ts from "gulp-typescript";
import * as nodemon from "gulp-nodemon";
import * as plumber from "gulp-plumber";
import * as sass from "gulp-sass";

@Gulpclass()
export class Gulpfile {


  static config = {
    server: {
      src: [
        path.resolve("./server/src/**/*.ts"),
        path.resolve("./server/typings/main.d.ts")
      ],
      dest: "",
      watchTasks: ["buildServer"]
    }
    client: {
      src: [
        path.resolve("./client/src/**/*.ts"),
        path.resolve("./client/typings/browser.d.ts")
      ],
      dest: "assets/js/client",
      watchTasks: ["buildClient"]
    },
    html: {
      src: path.resolve("./server/views/**/*.jade"),
      dest: "views",
      watchTasks: ["buildHtml"]
    },
    css: {
      src: path.resolve("./assets/css/**/*.scss"),
      dest: "assets/css",
      watchTasks: ["buildCss"]
    }
  };

  @Task("run", ["app", "watch"])
  run(){
  }

  @Task("app", ["buildServer", "buildHtml", "buildClient", "buildCss"])
  app(){
    let nodemonSettings = {
      script: path.resolve("./dist/app.js"),
      watch: path.resolve("./dist")
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

  @Task("watchServer")
  watchServer(){
    return gulp.watch(Gulpfile.config.server.src, Gulpfile.config.server.watchTasks);
  }

  @Task("watchClient")
  watchClient(){
    return gulp.watch(Gulpfile.config.client.src, Gulpfile.config.client.watchTasks);
  }

  @Task("watchHtml")
  watchHtml(){
    return gulp.watch(Gulpfile.config.html.src, Gulpfile.config.html.watchTasks);
  }

  @Task("watchCss")
  watchCss(){
    return gulp.watch(Gulpfile.config.css.src, Gulpfile.config.css.watchTasks);
  }

  @Task("buildServer")
  buildServer(){
    let tsProject = ts.createProject(path.resolve("./server/tsconfig.json"));

    return gulp
      .src(Gulpfile.config.server.src)
      .pipe(ts(tsProject))
      .js
      .pipe(gulp.dest(path.resolve("./dist", Gulpfile.config.server.dest)));
  }

  @Task("buildClient")
  buildClient(){
    let tsProject = ts.createProject(path.resolve("./client/tsconfig.json"));

    return gulp
      .src(Gulpfile.config.client.src)
      .pipe(ts(tsProject))
      .js
      .pipe(gulp.dest(path.resolve("./dist", Gulpfile.config.client.dest)));
  }

  @Task("buildHtml")
  buildHtml(){
    return gulp
      .src(Gulpfile.config.html.src)
      .pipe(gulp.dest(path.resolve("./dist", Gulpfile.config.html.dest)));
  }

  @Task("buildCss")
  buildCss(){
    return gulp
      .src(Gulpfile.config.css.src)
      .pipe(sass())
      .pipe(gulp.dest(path.resolve("./dist", Gulpfile.config.css.dest)));
  }

  @SequenceTask()
  default(){
    return ["buildClean"];
  }

}


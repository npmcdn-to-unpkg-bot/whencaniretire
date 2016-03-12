import {Gulpclass, SequenceTask, Task} from "gulpclass/Decorators";
import * as gulp from "gulp";
import * as del from "del";
import * as path from "path";
import * as ts from "gulp-typescript";
import * as nodemon from "gulp-nodemon";
import * as plumber from "gulp-plumber";

@Gulpclass()
export class Gulpfile {


  static paths = {
    server: [
      path.resolve("./server/src/**/*.ts"),
      path.resolve("./server/typings/main.d.ts")
    ],
    client: [
      path.resolve("./client/src/**/*.ts"),
      path.resolve("./client/typings/browser.d.ts")
    ],
    html: [
      path.resolve("./server/views/**/*.jade")
    ]
  };

  @Task("run", ["app", "watch"])
  run(){
  }

  @Task("app", ["buildServer", "buildClient", "buildHtml"])
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
    return ["clean", "run"]];
  }

  @Task("clean")
  clean(){
    return del(path.resolve("./dist/**"));
  }

  @Task("build", ["buildServer", "buildHtml", "buildClient"])
  build(){
    return;
  }

  @Task("watch", ["watchServer", "watchHtml", "watchClient"])
  watch(){
    return;
  }

  @Task("watchServer")
  watchServer(){
    return gulp.watch(Gulpfile.paths.server, ["buildServer"]);
  }

  @Task("watchClient")
  watchClient(){
    return gulp.watch(Gulpfile.paths.client, ["buildClient"]);
  }

  @Task("watchHtml")
  watchHtml(){
    return gulp.watch(Gulpfile.paths.html, ["buildHtml"]);
  }

  @Task("buildServer")
  buildServer(){
    let tsProject = ts.createProject(path.resolve("./server/tsconfig.json"));

    return gulp
      .src(Gulpfile.paths.server)
      .pipe(ts(tsProject))
      .js
      .pipe(gulp.dest(path.resolve("./dist")));
  }

  @Task("buildClient")
  buildClient(){
    let tsProject = ts.createProject(path.resolve("./client/tsconfig.json"));

    return gulp
      .src(Gulpfile.paths.client)
      .pipe(ts(tsProject))
      .js
      .pipe(gulp.dest(path.resolve("./dist/assets/js/client")));
  }

  @Task("buildHtml")
  buildHtml(){
    return gulp.src(Gulpfile.paths.html)
      .pipe(gulp.dest(path.resolve("./dist/views")));
  }

  @SequenceTask()
  default(){
    return ["buildClean"];
  }

}


import {Gulpclass, SequenceTask, Task} from "gulpclass/Decorators";
import * as gulp from "gulp";

import del = require("del");
import path = require("path");
import ts = require("gulp-typescript");

@Gulpclass()
export class Gulpfile {

  @SequenceTask("buildClean")
  buildClean(){
    return ["clean", "build"];
  }

  @Task("clean")
  clean(){
    return del(path.resolve("./dist/**"));
  }

  @SequenceTask("build")
  build(){
    return ["buildServer", "copyServerFiles"];
  }

  @Task("buildServer")
  buildServer(){
    let tsProject = ts.createProject(path.resolve("./server/tsconfig.json"));

    return gulp
      .src([
        path.resolve("./server/src/**/*.ts"),
        path.resolve("./server/typings/main.d.ts")
      ]
      )
      .pipe(ts(tsProject))
      .js
      .pipe(gulp.dest(path.resolve("./dist")));
  }

  @Task("copyServerFiles")
  copyServerFiles(){
    //return gulp
    gulp.src(path.resolve("./server/assets/**/*")).pipe(gulp.dest(path.resolve("./dist/assets")));
    gulp.src(path.resolve("./server/views/**/*")).pipe(gulp.dest(path.resolve("./dist/views")));
  }

  @SequenceTask()
  default(){
    return ["buildClean"];
  }

}

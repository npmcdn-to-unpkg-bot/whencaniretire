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
    return ["buildServer"];
  }

  @Task("buildServer")
  buildServer(){
    let tsProject = ts.createProject(path.resolve("./server/tsconfig.json"));

    return gulp
      .src(path.resolve("./server/src/**/*.ts"))
      .pipe(ts(tsProject))
      .js
      .pipe(gulp.dest(path.resolve("./dist")));
  }

  @SequenceTask()
  default(){
    return ["buildClean"];
  }

}

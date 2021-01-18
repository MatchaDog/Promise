/**
 * @Author: Hans
 * @Date: 2021-01-15 16:39:46
 * @LastEditTime: 2021-01-18 14:37:14
 * @LastEditors: Do not edit
 * @FilePath: /Promise/gulpfile.js
 * @Description:
 */
const { dest, series } = require("gulp");
const gulp = require("gulp");
const ts = require("gulp-typescript");
const babel = require("gulp-babel");
const del = require("del");

const projectEntry = "src/*.ts";

async function clean() {
    await del("lib/**");
    await del("es/**");
    await del("@types/**");
}

function commonjs() {
    const tsProject = ts.createProject("tsconfig.json", {
        module: "commonjs",
    });
    return gulp
        .src(projectEntry)
        .pipe(tsProject())
        .pipe(
            babel({
                configFile: "./.babelrc",
            }),
        )
        .pipe(dest("lib/"));
}

function es() {
    const tsProject = ts.createProject("tsconfig.json", {
        module: "ESNEXT",
    });
    return gulp.src(projectEntry).pipe(tsProject()).js.pipe(dest("es/"));
}

function declare() {
    const tsProject = ts.createProject("tsconfig.json", {
        // 生成相应的*.d.ts文件
        declaration: true,
        // 仅构建*.d.ts文件
        emitDeclarationOnly: true,
    });
    return gulp.src(projectEntry).pipe(tsProject()).pipe(dest("@types/")).pipe(dest("es/")).pipe(dest("lib/"));
}

exports.default = series(clean, commonjs, es, declare);

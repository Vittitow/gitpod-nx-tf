"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var devkit_1 = require("@nrwl/devkit");
var fs_extra_1 = require("fs-extra");
function tfbuildExecutor(options, context) {
    return __awaiter(this, void 0, void 0, function () {
        var project, outputPath, rootEnvPath, outputPath, envPath, envs, _i, envs_1, env, outputPath, envPath;
        return __generator(this, function (_a) {
            project = context.workspace.projects[context.projectName];
            if (project.projectType === 'library') {
                outputPath = (0, devkit_1.joinPathFragments)('dist', project.root);
                outputAssets(outputPath, project.root);
            }
            if (project.projectType == 'application') {
                rootEnvPath = (0, devkit_1.joinPathFragments)(project.root, 'env');
                if (options.env) {
                    outputPath = (0, devkit_1.joinPathFragments)('dist', project.root + "-" + options.env);
                    envPath = (0, devkit_1.joinPathFragments)(rootEnvPath, options.env);
                    outputAssets(outputPath, project.root, envPath);
                }
                else if ((0, fs_extra_1.pathExistsSync)(rootEnvPath)) {
                    envs = (0, fs_extra_1.readdirSync)(rootEnvPath, { withFileTypes: true })
                        .filter(function (file) { return file.isDirectory(); })
                        .map(function (dir) { return dir.name; });
                    for (_i = 0, envs_1 = envs; _i < envs_1.length; _i++) {
                        env = envs_1[_i];
                        outputPath = (0, devkit_1.joinPathFragments)('dist', project.root + "-" + env);
                        envPath = (0, devkit_1.joinPathFragments)(rootEnvPath, env);
                        outputAssets(outputPath, project.root, envPath);
                    }
                }
            }
            return [2 /*return*/, { success: true }];
        });
    });
}
exports["default"] = tfbuildExecutor;
function outputAssets(outputPath, projPath, envPath) {
    (0, fs_extra_1.removeSync)(outputPath);
    (0, fs_extra_1.copySync)(projPath, outputPath);
    var outputRootEnvPath = (0, devkit_1.joinPathFragments)(outputPath, 'env');
    if ((0, fs_extra_1.pathExistsSync)(outputRootEnvPath)) {
        (0, fs_extra_1.removeSync)(outputRootEnvPath);
    }
    if (envPath !== undefined && (0, fs_extra_1.pathExistsSync)(envPath)) {
        (0, fs_extra_1.copySync)(envPath, outputPath);
    }
}

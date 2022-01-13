import {
  ExecutorContext,
  formatFiles,
  generateFiles,
  joinPathFragments,
  logger,
  ProjectConfiguration,
} from '@nrwl/devkit';
import { flushChanges, FsTree, printChanges } from '@nrwl/tao/src/shared/tree';
import { execSync } from 'child_process';
import { resolve } from 'path';
import { pathExistsSync, readdirSync, removeSync } from 'fs-extra';

export const LARGE_BUFFER = 1024 * 1000000;

export interface TerraformBuildExecutorOptions {
  environments?: string;
}

export default async function terraformBuildExecutor(
  options: TerraformBuildExecutorOptions,
  context: ExecutorContext
) {
  const projectConfiguration = context.workspace.projects[context.projectName];
  const builds = getTerraformBuilds(
    projectConfiguration,
    options.environments === undefined
      ? []
      : options.environments.split(',').map((environment) => environment.trim())
  );

  for (let i = 0; i < builds.length; i++) {
    const tree = new FsTree(context.root, false);
    const build = builds[i];

    const envVars = require('dotenv').config({
      path: resolve(build.sourceEnv ?? build.sourceRoot, '.env'),
    });

    if (!envVars.error) require('dotenv-expand')(envVars);

    removeSync(build.target);
    generateFiles(tree, build.sourceRoot, build.target, process.env);

    if (build.sourceEnv)
      generateFiles(tree, build.sourceEnv, build.target, process.env);

    await formatFiles(tree);

    const fileChanges = tree.listChanges();

    printChanges(fileChanges);
    flushChanges(context.root, fileChanges);

    execSync(
      'tfenv install min-required && tfenv use min-required && terraform init -backend=false && terraform validate && tfsec',
      {
        env: process.env,
        stdio: [0, 1, 2],
        maxBuffer: LARGE_BUFFER,
        cwd: build.target,
      }
    );
  }

  return { success: true };
}

interface TerraformBuild {
  sourceEnv?: string;
  sourceRoot: string;
  target: string;
}

function getTerraformBuilds(
  projectConfiguration: ProjectConfiguration,
  environments: string[]
): TerraformBuild[] {
  if (projectConfiguration.projectType === 'library')
    return [
      {
        sourceRoot: projectConfiguration.sourceRoot,
        target: joinPathFragments('./dist', projectConfiguration.sourceRoot),
      },
    ];

  const path = joinPathFragments(projectConfiguration.root, './env');

  if (!pathExistsSync(path)) {
    logger.warn(`No environments found for app: '${projectConfiguration.name}'`);

    return [];
  }

  if (environments.length === 0) {
    logger.debug(
      `Attempting to build all environments for app: '${projectConfiguration.name}' as none were specified`
    );

    environments.push(
      ...readdirSync(path, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)
    );
  }

  const builds: TerraformBuild[] = [];

  for (let environment of environments) {
    const sourceEnv = joinPathFragments(path, `./${environment}`);

    if (!pathExistsSync(sourceEnv)) {
      logger.warn(
        `Environment: '${environment}' not found for app: '${projectConfiguration.name}'`
      );

      continue;
    }

    builds.push({
      sourceRoot: projectConfiguration.sourceRoot,
      sourceEnv: sourceEnv,
      target: joinPathFragments(
        './dist',
        projectConfiguration.sourceRoot,
        `../${environment}`
      ),
    });
  }

  return builds;
}

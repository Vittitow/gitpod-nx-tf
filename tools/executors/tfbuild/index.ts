import { ExecutorContext, joinPathFragments } from '@nrwl/devkit';
import { copySync, pathExistsSync, removeSync, readdirSync } from 'fs-extra';

export interface ExecutorOptions {
  outputPath?: string;
  env?: string;
}

export default async function tfbuildExecutor(
  options: ExecutorOptions,
  context: ExecutorContext
) {
  const project = context.workspace.projects[context.projectName];

  if (project.projectType === 'library') {
    const outputPath = joinPathFragments('dist', project.root);

    outputAssets(outputPath, project.root);
  }

  if (project.projectType == 'application') {
    const rootEnvPath = joinPathFragments(project.root, 'env');

    if(options.env) {
      const outputPath = joinPathFragments('dist', `${project.root}-${options.env}`);
      const envPath = joinPathFragments(rootEnvPath, options.env);

      outputAssets(outputPath, project.root, envPath);
    } else if (pathExistsSync(rootEnvPath)) {
      const envs = readdirSync(rootEnvPath, { withFileTypes: true })
      .filter(file => file.isDirectory())
      .map(dir => dir.name);

      for(let env of envs) {
        const outputPath = joinPathFragments('dist', `${project.root}-${env}`);
        const envPath = joinPathFragments(rootEnvPath, env);

        outputAssets(outputPath, project.root, envPath);
      }
    }
  }

  return { success: true };
}

function outputAssets(outputPath: string, projPath: string, envPath?: string) {
  removeSync(outputPath);
  copySync(projPath, outputPath);
  
  const outputRootEnvPath = joinPathFragments(outputPath, 'env');

  if(pathExistsSync(outputRootEnvPath)) {
    removeSync(outputRootEnvPath);
  }

  if(envPath !== undefined && pathExistsSync(envPath)) {
    copySync(envPath, outputPath);
  }
}

import { ExecutorContext, joinPathFragments } from '@nrwl/devkit';
import { copySync, pathExistsSync, removeSync, readdirSync } from 'fs-extra';

export interface ExecutorOptions {
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

      if(pathExistsSync(envPath)) {
        outputAssets(outputPath, project.root, envPath);
      }

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
  const outputRootEnvPath = joinPathFragments(outputPath, 'env');

  removeSync(outputPath);

  if (!pathExistsSync(projPath))
    return;

  copySync(projPath, outputPath);

  if(pathExistsSync(outputRootEnvPath)) {
    removeSync(outputRootEnvPath);
  }

  if(envPath !== undefined && pathExistsSync(envPath)) {
    copySync(envPath, outputPath);
  }
}

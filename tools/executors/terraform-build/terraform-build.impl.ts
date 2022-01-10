import { ExecutorContext } from '@nrwl/devkit';
import { exec } from 'child_process';
import { promisify } from 'util';
import { copySync, pathExistsSync, removeSync, readdirSync } from 'fs-extra';

export interface TerraformBuildExecutorOptions {
}

export default async function terraformBuildExecutor(
  options: TerraformBuildExecutorOptions,
  context: ExecutorContext
) {
  const projectConfiguration = context.workspace.projects[context.projectName];

  if(projectConfiguration === undefined) return { sucess: true }

  // TODO
}

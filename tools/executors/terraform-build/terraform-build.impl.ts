import {
  ExecutorContext,
  formatFiles,
  generateFiles,
  joinPathFragments,
} from '@nrwl/devkit';
import { flushChanges, FsTree, printChanges } from '@nrwl/tao/src/shared/tree';
import { execSync } from 'child_process';
import { removeSync } from 'fs-extra';

export const LARGE_BUFFER = 1024 * 1000000;

export interface TerraformBuildExecutorOptions {}

export default async function terraformBuildExecutor(
  options: TerraformBuildExecutorOptions,
  context: ExecutorContext
) {
  const projectConfiguration = context.workspace.projects[context.projectName];

  if (
    projectConfiguration === undefined ||
    (projectConfiguration.projectType === 'application' &&
      projectConfiguration.sourceRoot.includes('/src'))
  )
    return { success: true };

  const tree = new FsTree(context.root, false);
  const target = joinPathFragments(
    'dist',
    projectConfiguration.sourceRoot.replace('/env', '')
  );
  const envVars = require('dotenv').config({
    path: `${projectConfiguration.sourceRoot}/.env`,
  });

  if (!envVars.error) require('dotenv-expand')(envVars);

  removeSync(target);
  generateFiles(
    tree,
    projectConfiguration.sourceRoot,
    target,
    process.env
  );

  await formatFiles(tree);

  const fileChanges = tree.listChanges();

  printChanges(fileChanges);
  flushChanges(context.root, fileChanges);

  execSync('tfenv use > nul && terraform init -backend=false -get=false > nul && terraform validate > nul && tfsec', {
    env: process.env,
    stdio: [0, 1, 2],
    maxBuffer: LARGE_BUFFER,
    cwd: target
  });

  return { success: true };
}

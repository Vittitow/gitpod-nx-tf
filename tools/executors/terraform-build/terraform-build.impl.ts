import { ExecutorContext, formatFiles, generateFiles, joinPathFragments } from '@nrwl/devkit';
import { flushChanges, FsTree, printChanges } from '@nrwl/tao/src/shared/tree';
import { execSync } from 'child_process';
import { promisify } from 'util';
import { copySync, pathExistsSync, removeSync, readdirSync } from 'fs-extra';

export interface TerraformBuildExecutorOptions {}

export default async function terraformBuildExecutor(
  options: TerraformBuildExecutorOptions,
  context: ExecutorContext
) {
  const projectConfiguration = context.workspace.projects[context.projectName];

  if (projectConfiguration === undefined) return { success: true };

  if (
    projectConfiguration.projectType === 'application' &&
    projectConfiguration.sourceRoot.includes('/src')
  )
    return { success: true };

  const target = joinPathFragments('dist', projectConfiguration.sourceRoot);

  removeSync(target);

  const tree = new FsTree(context.root, false);

  generateFiles(
    tree,
    projectConfiguration.sourceRoot,
    target,
    {

    }
  )

  await formatFiles(tree);

  const fileChanges = tree.listChanges();

  printChanges(fileChanges);
  flushChanges(context.root, fileChanges);

  return { success: true }
}

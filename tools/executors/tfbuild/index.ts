import { ExecutorContext, joinPathFragments } from '@nrwl/devkit';
import { copySync, emptyDirSync, pathExistsSync, removeSync } from 'fs-extra';

export default async function tfbuildExecutor(
  options: any,
  context: ExecutorContext
) {
  const project = context.workspace.projects[context.projectName];

  if (options.deleteOutputPath) {
    emptyDirSync(options.outputPath);
  }

  copySync(project.root, options.outputPath);

  if (project.projectType == 'application' && options.env !== undefined) {
    const envDir = joinPathFragments(project.root, `env/${options.env}`);

    if (pathExistsSync(envDir)) {
      copySync(envDir, options.outputPath);
    }

    if (pathExistsSync(joinPathFragments(options.outputPath, 'env'))) {
      removeSync(joinPathFragments(options.outputPath, 'env'));
    }
  }

  const success = true;
  return { success };
}

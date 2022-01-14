import {
  getWorkspaceLayout,
  joinPathFragments,
  ProjectConfiguration,
  ProjectType,
  Tree,
  names
} from '@nrwl/devkit';

export interface TerraformProjectOptions {
  name: string;
  tags?: string;
}

export function terraformProjectConfiguration(
  tree: Tree,
  options: TerraformProjectOptions,
  projectType: ProjectType
): ProjectConfiguration {
  const workspaceLayout = getWorkspaceLayout(tree);

  const root = joinPathFragments(
    projectType === 'application'
      ? workspaceLayout.appsDir
      : workspaceLayout.libsDir,
    options.name.toLowerCase()
  );

  const sourceRoot = joinPathFragments(root, './src');

  const projectConfiguration: ProjectConfiguration = {
    name: names(options.name.replace('/', '-')).fileName,
    targets: {
      build: {
        executor: './tools/executors:terraform-build'
      },
      lint: {
        executor: './tools/executors:terraform-lint'
      }
    },
    root: root,
    sourceRoot: sourceRoot,
    projectType: projectType,
    tags: options.tags?.split(',').map(tag => tag.trim()),
  };

  return projectConfiguration;
}

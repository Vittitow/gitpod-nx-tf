import {
  getWorkspaceLayout,
  joinPathFragments,
  ProjectConfiguration,
  ProjectType,
  Tree,
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
    options.name
  );

  const sourceRoot = joinPathFragments(root, './src');

  const projectConfiguration: ProjectConfiguration = {
    name: options.name.replace('/', '-'),
    root: root,
    sourceRoot: sourceRoot,
    projectType: projectType,
    tags: options.tags?.split(',').map(tag => tag.trim()),
  };

  return projectConfiguration;
}

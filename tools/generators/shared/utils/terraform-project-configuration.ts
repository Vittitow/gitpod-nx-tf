import {
  getWorkspaceLayout,
  joinPathFragments,
  ProjectConfiguration,
  Tree,
} from '@nrwl/devkit';

export interface TerraformProjectOptions {
  name: string;
  tags?: string;
}

export enum TerraformProjectType {
  Application,
  ApplicationEnvironment,
  Library,
}

export function terraformProjectConfiguration(
  tree: Tree,
  options: TerraformProjectOptions,
  projectType: TerraformProjectType
): ProjectConfiguration {
  const workspaceLayout = getWorkspaceLayout(tree);

  const root = joinPathFragments(
    projectType === TerraformProjectType.Library
      ? workspaceLayout.libsDir
      : workspaceLayout.appsDir,
    options.name
  );

  const sourceRoot = joinPathFragments(
    root,
    projectType === TerraformProjectType.ApplicationEnvironment ? '' : 'src'
  );

  const projectConfiguration: ProjectConfiguration = {
    name: options.name,
    root: root,
    sourceRoot: sourceRoot,
    projectType:
      projectType === TerraformProjectType.Library ? 'library' : 'application',
    tags: options.tags?.split(' '),
  };

  if (projectType === TerraformProjectType.ApplicationEnvironment)
    projectConfiguration.implicitDependencies = [options.name.split('/')[0]];

  return projectConfiguration;
}

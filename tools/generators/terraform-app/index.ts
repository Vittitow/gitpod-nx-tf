import { addProjectConfiguration, formatFiles, generateFiles, joinPathFragments, Tree } from '@nrwl/devkit';
import {
  terraformProjectConfiguration,
  TerraformProjectType,
  TerraformProjectOptions,
} from '../shared/utils/terraform-project-configuration';

export default async function (
  tree: Tree,
  options: TerraformProjectOptions
) {
  const projectConfiguration = terraformProjectConfiguration(
    tree,
    options,
    TerraformProjectType.Application
  );

  addProjectConfiguration(
    tree,
    options.name,
    projectConfiguration,
    false
  );

  generateFiles(
    tree,
    joinPathFragments(__dirname, '../shared/files'),
    projectConfiguration.sourceRoot,
    {}
  );

  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files'),
    projectConfiguration.sourceRoot,
    {
      app: projectConfiguration.name
    }
  );

  await formatFiles(tree);
}

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
    TerraformProjectType.ApplicationEnvironment
  );

  addProjectConfiguration(
    tree,
    options.name,
    projectConfiguration,
    false
  );

  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files'),
    projectConfiguration.sourceRoot,
    {
      env: projectConfiguration.name.split('/').pop()
    }
  );

  await formatFiles(tree);
}

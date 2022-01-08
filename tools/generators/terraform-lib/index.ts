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
    TerraformProjectType.Library
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

  await formatFiles(tree);
}

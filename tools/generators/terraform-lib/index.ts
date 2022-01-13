import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  joinPathFragments,
  Tree,
} from '@nrwl/devkit';
import {
  terraformProjectConfiguration,
  TerraformProjectOptions,
} from '../shared/utils/terraform-project-configuration';

export default async function (tree: Tree, options: TerraformProjectOptions) {
  const projectConfiguration = terraformProjectConfiguration(
    tree,
    options,
    'library'
  );

  addProjectConfiguration(
    tree,
    projectConfiguration.name,
    projectConfiguration,
    true
  );

  generateFiles(
    tree,
    joinPathFragments(__dirname, '../shared/files'),
    projectConfiguration.root,
    {}
  );

  await formatFiles(tree);
}

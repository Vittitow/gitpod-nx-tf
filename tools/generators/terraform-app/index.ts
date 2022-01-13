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
    'application'
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

  generateFiles(
    tree,
    joinPathFragments(__dirname, './files'),
    projectConfiguration.root,
    {
      app: projectConfiguration.name,
      env: '<%= env %>',
    }
  );

  await formatFiles(tree);
}

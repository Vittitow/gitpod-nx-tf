import {
  getProjects,
  formatFiles,
  generateFiles,
  joinPathFragments,
  Tree,
} from '@nrwl/devkit';

export interface TerraformAppEnvOptions {
  app: string;
  env: string;
}

export default async function (tree: Tree, options: TerraformAppEnvOptions) {
  const projectConfiguration = getProjects(tree).get(options.app);

  if (projectConfiguration === undefined)
    throw new Error(
      `Project configuration for app ${options.app} not found in worspace`
    );

  generateFiles(
    tree,
    joinPathFragments(__dirname, './files'),
    joinPathFragments(projectConfiguration.root, './env', options.env),
    {
      env: options.env,
    }
  );

  await formatFiles(tree);
}

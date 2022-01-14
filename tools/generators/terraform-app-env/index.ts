import { convertFiles } from '@cdktf/hcl2json';
import {
  getProjects,
  formatFiles,
  generateFiles,
  joinPathFragments,
  Tree,
} from '@nrwl/devkit';
import { pathExistsSync } from 'fs-extra';

export interface TerraformAppEnvOptions {
  app: string;
  env: string;
}

export default async function (tree: Tree, options: TerraformAppEnvOptions) {
  const projectConfiguration = getProjects(tree).get(options.app);

  if (!projectConfiguration)
    throw new Error(
      `Project configuration for app: '${options.app}' not found in workspace`
    );

  const target = joinPathFragments(
    projectConfiguration.root,
    './env',
    options.env
  );

  if (pathExistsSync(target))
    throw new Error(
      `Environment: '${options.env}' already exists for app: '${projectConfiguration.name}' `
    );

  const json = await convertFiles(projectConfiguration.sourceRoot);
  const variables = Object.keys(json['variable'] ?? [])
    .map((variable) => `${variable} = null`)
    .join('\n');

  generateFiles(tree, joinPathFragments(__dirname, './files'), target, {
    env: options.env,
    variables: variables,
  });

  await formatFiles(tree);
}


import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  joinPathFragments,
  names,
  ProjectConfiguration,
  Tree,
} from '@nrwl/devkit';

export default async function (host: Tree, schema: any) {    
  const projectConfiguration: ProjectConfiguration = {
    root: `${getWorkspaceLayout(host).libsDir}/${schema.name}`,
    projectType: 'library',
    sourceRoot: `${getWorkspaceLayout(host).libsDir}/${schema.name}`,
    targets: {},
    tags: null,
  };

  addProjectConfiguration(
    host,
    names(schema.name).fileName,
    projectConfiguration,
    false,
  );
  
  generateFiles(
    // virtual file system
    host,

    // the location where the template files are
    joinPathFragments(__dirname, './files'),

    // where the files should be generated
    `${getWorkspaceLayout(host).libsDir}/${schema.name}`,

    // the variables to be substituted in the template
    {
      name: schema.name
    }
  );

  await formatFiles(host);
}
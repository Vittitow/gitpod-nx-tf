
import {
  formatFiles,
  generateFiles,
  joinPathFragments,
  names,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration
} from '@nrwl/devkit';


export default async function (host: Tree, schema: any) {    

  const projectConfiguration = readProjectConfiguration(host, schema.app);

  projectConfiguration.targets[`plan:${schema.env}`] = {
    'executor': '@nrwl/workspace:run-commands',
    'options': {
      'commands': [
        'tfenv use',
        'terraform init',
        `terraform plan --out=${names(schema.app).fileName}.${schema.env}.tfplan`
      ],
      'cwd': projectConfiguration.root,
      'envFile': `${projectConfiguration.root}/env/${schema.env}/.${schema.env}.env`,
      'parallel': false
    }
  }

  updateProjectConfiguration(host, schema.app, projectConfiguration);

  generateFiles(
    // virtual file system
    host,

    // the location where the template files are
    joinPathFragments(__dirname, './files'),

    // where the files should be generated
    `${projectConfiguration.root}/env/${schema.env}`,

    // the variables to be substituted in the template
    {
      app: schema.app,
      env: schema.env
    }
  );

  await formatFiles(host);
}
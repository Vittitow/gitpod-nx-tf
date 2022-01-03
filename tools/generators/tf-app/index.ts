
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
    root: `${getWorkspaceLayout(host).appsDir}/${schema.name}`,
    projectType: 'application',
    sourceRoot: `${getWorkspaceLayout(host).appsDir}/${schema.name}`,
    targets: {
      'pre-commit': {
        'executor': '@nrwl/workspace:run-commands',
        'options': {
          'commands': [
            'tfenv use',
            'terraform init -backend=false',
            'terraform validate',
            'terraform fmt -recursive',
            'tflint',
            'tfsec',
            'terraform-docs markdown table --output-file README.md --output-mode inject .'
          ],
          'cwd': `${getWorkspaceLayout(host).appsDir}/${schema.name}`,
          'parallel': false
        }
      },
      'plan': {
        'executor': '@nrwl/workspace:run-commands',
        'options': {
          'commands': [
            'tfenv use',
            'terraform init',
            `terraform plan --out=${names(schema.name).fileName}.tfplan`
          ],
          'cwd': `${getWorkspaceLayout(host).appsDir}/${schema.name}`,
          'parallel': false
        }
      }
    },
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
    `${getWorkspaceLayout(host).appsDir}/${schema.name}`,

    // the variables to be substituted in the template
    {
      name: schema.name
    }
  );

  await formatFiles(host);
}
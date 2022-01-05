import { ExecutorContext, joinPathFragments } from '@nrwl/devkit';
import { execSync } from 'child_process';
import { pathExistsSync, readdirSync } from 'fs-extra';
// import { promisify } from 'util';

export const LARGE_BUFFER = 1024 * 1000000;

export interface ExecutorOptions {
  env?: string;
}

export default async function echoExecutor(
  options: ExecutorOptions,
  context: ExecutorContext
) {
  const project = context.workspace.projects[context.projectName];
  const rootEnvPath = joinPathFragments(project.root, 'env');

  if(options.env) {
    
    const outputPath = joinPathFragments('dist', `${project.root}-${options.env}`);

    executePlan(outputPath);

  }
  else if (pathExistsSync(rootEnvPath)) {

    const envs = readdirSync(rootEnvPath, { withFileTypes: true })
      .filter(file => file.isDirectory())
      .map(dir => dir.name);

    for(let env of envs) {
      
      const outputPath = joinPathFragments('dist', `${project.root}-${env}`);

      executePlan(outputPath);

    }

  }

  return { success: true };
}

async function executePlan(outputPath: string) {
  if (!pathExistsSync(outputPath))
    return;
    
  execSync('tfenv use && terraform init && terraform plan --out=.tfplan', {
    // env: {},
    stdio: [0, 1, 2],
    maxBuffer: LARGE_BUFFER,
    cwd: outputPath
  }); 
}
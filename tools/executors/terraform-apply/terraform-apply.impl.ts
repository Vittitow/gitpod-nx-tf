import {
  ExecutorContext,
  joinPathFragments,
  logger,
  ProjectConfiguration,
} from '@nrwl/devkit';
import { execSync } from 'child_process';
import { resolve } from 'path';
import { pathExistsSync, readdirSync } from 'fs-extra';

export const LARGE_BUFFER = 1024 * 1000000;

export interface TerraformApplyExecutorOptions {
  environments?: string;
}

export default async function terraformApplyExecutor(
  options: TerraformApplyExecutorOptions,
  context: ExecutorContext
) {
  const projectConfiguration = context.workspace.projects[context.projectName];
  const applies = getTerraformApplies(
    projectConfiguration,
    options.environments === undefined
      ? []
      : options.environments.split(',').map((environment) => environment.trim())
  );

  for (let i = 0; i < applies.length; i++) {
    const apply = applies[i];

    const envVars = require('dotenv').config({
      path: resolve(apply.target, '.env'),
    });

    if (!envVars.error) require('dotenv-expand')(envVars);

    execSync(
      'tfenv install min-required && tfenv use min-required && terraform init && terraform apply -input=false terraform.tfplan',
      {
        env: process.env,
        stdio: [0, 1, 2],
        maxBuffer: LARGE_BUFFER,
        cwd: apply.target,
      }
    );
  }

  return { success: true };
}

interface TerraformApply {
  target: string;
}

function getTerraformApplies(
  projectConfiguration: ProjectConfiguration,
  environments: string[]
): TerraformApply[] {
  const path = joinPathFragments('./dist/', projectConfiguration.root);

  if (!pathExistsSync(path)) {
    logger.warn(
      `App: '${projectConfiguration.name}' not found so no applies will be ran`
    );

    return [];
  }

  if (environments.length === 0) {
    logger.debug(
      `Attempting to apply all environments for app: '${projectConfiguration.name}' as none were specified`
    );

    environments.push(
      ...readdirSync(path, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)
    );
  }

  const applies: TerraformApply[] = [];

  for (let environment of environments) {
    const target = joinPathFragments(path, `./${environment}`);

    if (!pathExistsSync(target)) {
      logger.warn(
        `Unable to apply environment: '${environment}' as it was not found for app: '${projectConfiguration.name}'`
      );

      continue;
    }

    if(!pathExistsSync(resolve(target, 'terraform.tfplan'))) {
      logger.warn(
        `No plan file found for environment: '${environment}' in app: '${projectConfiguration.name}' so it will be skipped`
      )
    }

    applies.push({
      target: target,
    });
  }

  return applies;
}

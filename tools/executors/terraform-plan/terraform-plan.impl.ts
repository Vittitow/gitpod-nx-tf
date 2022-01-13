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

export interface TerraformPlanExecutorOptions {
  environments?: string;
}

export default async function terraformPlanExecutor(
  options: TerraformPlanExecutorOptions,
  context: ExecutorContext
) {
  const projectConfiguration = context.workspace.projects[context.projectName];
  const plans = getTerraformPlans(
    projectConfiguration,
    options.environments === undefined
      ? []
      : options.environments.split(',').map((environment) => environment.trim())
  );

  for (let i = 0; i < plans.length; i++) {
    const plan = plans[i];

    const envVars = require('dotenv').config({
      path: resolve(plan.target, '.env'),
    });

    if (!envVars.error) require('dotenv-expand')(envVars);

    execSync(
      'tfenv install min-required && tfenv use min-required && terraform init && terraform plan -out=terraform.tfplan',
      {
        env: process.env,
        stdio: [0, 1, 2],
        maxBuffer: LARGE_BUFFER,
        cwd: plan.target,
      }
    );
  }

  return { success: true };
}

interface TerraformPlan {
  target: string;
}

function getTerraformPlans(
  projectConfiguration: ProjectConfiguration,
  environments: string[]
): TerraformPlan[] {
  const path = joinPathFragments('./dist/', projectConfiguration.root);

  if (!pathExistsSync(path)) {
    logger.warn(
      `App: '${projectConfiguration.name}' not found so no plans will be ran`
    );

    return [];
  }

  if (environments.length === 0) {
    logger.debug(
      `Attempting to plan all environments for app: '${projectConfiguration.name}' as none were specified`
    );

    environments.push(
      ...readdirSync(path, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)
    );
  }

  const plans: TerraformPlan[] = [];

  for (let environment of environments) {
    const target = joinPathFragments(path, `./${environment}`);

    if (!pathExistsSync(target)) {
      logger.warn(
        `Unable to plan environment: '${environment}' as it was not found for app: '${projectConfiguration.name}'`
      );

      continue;
    }

    plans.push({
      target: target,
    });
  }

  return plans;
}

import { ExecutorContext } from '@nrwl/devkit';
import run_commands, {
  RunCommandsBuilderOptions,
} from '@nrwl/workspace/src/executors/run-commands/run-commands.impl';

export interface terraformLintExecutorOptions {}

export default async function terraformLintExecutor(
  options: terraformLintExecutorOptions,
  context: ExecutorContext
) {
  const projectConfiguration = context.workspace.projects[context.projectName];

  if (projectConfiguration === undefined) return { success: true };

  const commands = [
    {
      command: 'terraform fmt',
      forwardAllArgs: false,
    },
    {
      command: 'tflint',
      forwardAllArgs: false,
    },
  ];

  if (!projectConfiguration.sourceRoot.includes('/env/'))
    commands.push({
      command: 'terraform-docs .',
      forwardAllArgs: false,
    });

  const runCommandsBuilderOptions: RunCommandsBuilderOptions = {
    commands: commands,
    cwd: projectConfiguration.sourceRoot,
    parralel: false,
  };

  return await run_commands(runCommandsBuilderOptions, context);
}

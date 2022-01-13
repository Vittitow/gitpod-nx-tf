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
  const commands = [
    {
      command: 'cd .. && terraform fmt -recursive',
      forwardAllArgs: false,
    },
    {
      command: 'tflint --init && tflint',
      forwardAllArgs: false,
    },
    {
      command: 'terraform-docs .',
      forwardAllArgs: false,
    },
  ];

  const runCommandsBuilderOptions: RunCommandsBuilderOptions = {
    commands: commands,
    cwd: projectConfiguration.sourceRoot,
    parralel: false,
  };

  return await run_commands(runCommandsBuilderOptions, context);
}

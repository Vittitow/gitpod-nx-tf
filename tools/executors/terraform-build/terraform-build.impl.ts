import { ExecutorContext } from '@nrwl/devkit';
import { exec } from 'child_process';
import { promisify } from 'util';
import run_commands from '@nrwl/workspace/src/executors/run-commands/run-commands.impl'

export interface EchoExecutorOptions {
  textToEcho: string;
}

export default async function echoExecutor(
  options: EchoExecutorOptions,
  context: ExecutorContext
) {
  console.info(`Executing "echo"...`);
  console.info(`Options: ${JSON.stringify(options, null, 2)}`);

  const { stdout, stderr } = await promisify(exec)(
    `echo ${options.textToEcho}`
  );
  console.log(stdout);
  console.error(stderr);

  const success = !stderr;
  return { success };
}

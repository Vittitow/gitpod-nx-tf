// @ts-check
const { parse } = require('@cdktf/hcl2json');
const { ProjectGraphBuilder, joinPathFragments } = require('@nrwl/devkit');
const globby = require('globby');
const { resolve } = require('path');
const { readFile } = require('fs-extra');

/**
 * Nx Project Graph plugin for terraform
 *
 * @param {import('@nrwl/devkit').ProjectGraph} graph
 * @param {import('@nrwl/devkit').ProjectGraphProcessorContext} context
 * @returns {Promise<import('@nrwl/devkit').ProjectGraph>}
 */
exports.processProjectGraph = async (graph, context) => {
  const builder = new ProjectGraphBuilder(graph);
  const projects = context.workspace.projects;

  await Promise.all(
    Object.entries(projects).map(async ([name, project]) => {
      try {
        for await (const file of globby.stream('**/*.tf*', {
          cwd: project.root,
          gitignore: true,
        })) {
          const hcl = await readFile(resolve(project.root, file.toString()));
          const json = await parse(file.toString(), hcl.toString());

          Object.values(json.module ?? []).forEach((module) => {
            Object.values(module.filter((input) => input.source)).forEach(
              (input) => {
                const source = resolve(project.sourceRoot, input.source);
                const dependency = Object.keys(projects).find(
                  (key) => resolve(projects[key].sourceRoot) === source
                );

                if (dependency)
                  builder.addExplicitDependency(
                    name,
                    joinPathFragments(project.root, file.toString()),
                    dependency
                  );
              }
            );
          });

          Object.keys(json.data?.terraform_remote_state ?? []).forEach(
            (state) => {
              const dependency = Object.keys(projects).find(
                (key) => key === state.replace('_', '-')
              );

              if (dependency)
                builder.addExplicitDependency(
                  name,
                  joinPathFragments(project.root, file.toString()),
                  dependency
                );
            }
          );
        }
      } catch (e) {
        console.warn(
          `nx-terraform encountered an error parsing dependencies for ${name}:\n${e}`,
        );
      }
    })
  );

  return builder.getUpdatedProjectGraph();
};

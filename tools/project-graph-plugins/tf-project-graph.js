// @ts-check
const { convertFiles } = require('@cdktf/hcl2json');
const { ProjectGraphBuilder, joinPathFragments } = require('@nrwl/devkit');
const globby = require('globby');
const { resolve } = require('path');

/**
 * Nx Project Graph plugin for tf
 *
 * @param {import('@nrwl/devkit').ProjectGraph} graph
 * @param {import('@nrwl/devkit').ProjectGraphProcessorContext} context
 * @returns {Promise<import('@nrwl/devkit').ProjectGraph>}
 */
exports.processProjectGraph = async (graph, context) => {
  const builder = new ProjectGraphBuilder(graph);

  for (const projectName in context.workspace.projects) {
    const path = context.workspace.projects[projectName].sourceRoot;
    const files = await globby('**/*.tf*', { cwd: path, gitignore: true });
    const json = await convertFiles(path);

    for (const module in json['module']) {
      const source = resolve(json['module'][module][0].source);
      const dependency = Object.keys(context.workspace.projects).find(
        (key) => `/${context.workspace.projects[key].sourceRoot}` === source
      );

      if (dependency !== undefined)
        for (let i = 0; i < files.length; i++) {
          builder.addExplicitDependency(
            projectName,
            joinPathFragments(path, files[i]),
            dependency
          );
        }
    }
  }

  return builder.getUpdatedProjectGraph();
};

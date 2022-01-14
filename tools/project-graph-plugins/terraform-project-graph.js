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
  const projects = context.workspace.projects;

  for (const projectName in projects) {
    const path = projects[projectName].sourceRoot;
    const files = await globby('**/*.*', { cwd: path, gitignore: true });
    const json = await convertFiles(path);

    Object.values(json['module'] ?? []).forEach((value) =>
      Object.entries(value).forEach((entry) =>
        Object.values(entry)
          .filter((value) => value['source'])
          .forEach((value) => {
            const dependency = Object.keys(projects).find(
              (key) => `/${projects[key].sourceRoot}` === value.source
            );

            addExplicitDependency(
              builder,
              projectName,
              path,
              files,
              dependency
            );
          })
      )
    );

    Object.keys(json['data']?.terraform_remote_state ?? []).forEach((name) => {
      const dependency = Object.keys(projects).find((key) => key === name);

      addExplicitDependency(builder, projectName, path, files, dependency);
    });
  }

  return builder.getUpdatedProjectGraph();
};

/**
 * @param {import('@nrwl/devkit').ProjectGraphBuilder} builder
 * @param {string} projectName
 * @param {string} path
 * @param {string[]} files
 * @param {string} dependency
 * @returns {void}
 */
function addExplicitDependency(builder, projectName, path, files, dependency) {
  if (dependency === undefined) return;

  for (let i = 0; i < files.length; i++) {
    builder.addExplicitDependency(
      projectName,
      joinPathFragments(path, files[i]),
      dependency
    );
  }
}

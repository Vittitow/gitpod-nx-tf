// @ts-check
const { ProjectGraphBuilder, joinPathFragments } = require('@nrwl/devkit');
const execa = require('execa');
const { resolve } = require('path');
const { appRootPath } = require('@nrwl/tao/src/utils/app-root');

/**
 * Nx Project Graph plugin for tf
 *
 * @param {import('@nrwl/devkit').ProjectGraph} graph
 * @param {import('@nrwl/devkit').ProjectGraphProcessorContext} context
 * @returns {import('@nrwl/devkit').ProjectGraph}
 */
exports.processProjectGraph = (graph, context) => {
  // This is an example so the `context` is not used for simplicity.
  // Let's take a look at some stuff that is included though.

  // The `workspace` property in `context` has the different projects in the workspace.
  // console.log(context.workspace);

  // The `fileMap` property in `context` has the files that belong to the different projects in the workspace
  // This only has files that need to be re-processsed because they've changed.
  // If you uncomment the next line and make a change in `./executables/cmd/hello/main.go`..
  // You will see that only that file shows up in the fileMap because other files do not need to be reprocessed.
  // console.log(context.fileMap);

  const builder = new ProjectGraphBuilder(graph);
  
  for (const projectName in context.workspace.projects) {
    const path = joinPathFragments(appRootPath, context.workspace.projects[projectName].root);
    const completedSubprocess = execa.sync('terraform-docs', [
      'json',
      path
    ]);

    const firstPartyData = JSON.parse(completedSubprocess.stdout);

    for (let i = 0; i < firstPartyData.modules.length; i++) {
      const dependency = Object
        .keys(context.workspace.projects)
        .find(key => `/${context.workspace.projects[key].root}` === resolve(firstPartyData.modules[i].source));

      if(dependency !== undefined)
        builder.addImplicitDependency(projectName, dependency);
    }
  }

  return builder.getUpdatedProjectGraph();
};
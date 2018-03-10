const fs = require("fs");
const path = require("path");
const Directory = require("./directory");

class Module {

}


Module.NODE_MODULES = "node_modules";

/**
 * Renvoit la représentation de l'arborescence de tous le modules trouvés "<name>@<version>"
 * @param {String} dir répertoire dans lequel chercher les modules ex : mon_project/node_modules
 */
Module.getArborescence = function (dir) {

  let deps  = Module.getModuleList(dir);
  let arbo = {};
  let level = 1;

  // premiere passe, on les modules de premier niveaux
  let main = deps.filter(dep => dep.level == 0);
  main.forEach(dep => arbo[dep.name + "@" + dep.version] = {})

  // on recré l'arborescence niveau par niveau
  let levelFind = true;

  while(levelFind) {
    levelFind = false;
    deps.forEach((dep) => {
      if(dep.level == level) {
        levelFind = true;
        constructArbo(arbo, dep);
      }
    });
    level++;
  }

  return arbo;

  /**
   * contrrruit l'obet d'arborescence suivant une dépendance
   * @param {Object} arbo l'arborescence des modules
   * @param {Object} dep représentation d'un module
   */
  function constructArbo(arbo, dep) {
    let parts = [];
    getPropertyPath(dep, parts);
    let o = arbo;
    if (parts.length > 1) {
      for (var i = 0; i < parts.length - 1; i++) {
          if (!o[parts[i]])
              o[parts[i]] = {};
          o = o[parts[i]];
      }
    }

    o[parts[parts.length - 1]] = {};
  }

  /**
   * Complète le chemin d'accès d'un module dans l'objet d'arborescence
   * @param {Object} dep représentation d'un module
   * @param {Array} propertyPath chemin acces de la dépendance
   */
  function getPropertyPath(dep, propertyPath) {
    propertyPath.unshift(dep.name + "@" + dep.version)
    if(dep.parent) {
      getPropertyPath( dep.parent, propertyPath);
    }
  }
};

/**
 * Renvoit la liste de tous le modules trouvés "<name>@<version>"
 * @param {String} dir répertoire dans lequel chercher les modules ex : mon_project/node_modules
 */
Module.getList = function (dir) {
  let deps  = Module.getModuleList(dir);
  let list = {};

  deps.forEach(dep => list[dep.name + "@" + dep.version] = {});

  return list;
}

/**
 * renvoit la liste des modules trouvés dans un répertoire
 * @param {String} dir répertoire dans lequel chercher les modules ex : mon_project/node_modules
 */
Module.getModuleList = function (dir) {
  var moduleList = [];


  Directory.readDirRecursiveAndCallBackOnDir(null, dir, (dir, file, parent) => {
    var packagePath = path.join(dir, file, "package.json");
    if(file === Module.NODE_MODULES) {
      return parent;
    }
    if (!fs.existsSync(packagePath)) {
      // pas de package.json, pas un module
      return false;
    }
    var packageDef = require(packagePath);

    let project = Directory.getProject(path.join(dir, file), parent)

    moduleList.push(project);
    return project;
  });

  return moduleList;
};

module.exports = Module;
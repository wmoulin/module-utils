const fs = require("fs");
const path = require("path");

class Directory {

}

/**
 * Lit un repertoire de manière récursive en applicant le callback sur chaque dossier,
 *  le callback doit retourner une valeur autre que false pour lire le sous dossier
 * @param {Object} parent représentation du module parent
 * @param {String} dir répertoire à llister
 * @param {Function} callback fonction appelée pour les sous-répertoires
 */
Directory.readDirRecursiveAndCallBackOnDir = function (parent, dir, callback) {

  var files = fs.readdirSync(dir);

  files.forEach(function (file) {
      var nextRead = path.join(dir, file);
      var stats = fs.lstatSync(nextRead);
      if (stats.isDirectory()) {
        let parentModule = callback(dir, file, parent);
        if (parentModule) {
          Directory.readDirRecursiveAndCallBackOnDir(parentModule, nextRead + path.sep, callback);
        }
      }
  });
};

/**
 * renvoit la représentation d'un module si un fichier package.json existe
 * @param {String} dir répertoire dans lequel chercher les modules ex : mon_project/node_modules
 * @param {Object} parent représentation du module parent
 * @returns {Object} représentation du module
 */
Directory.getProject = function (dir, parent) {
  let packageJsonPath = path.join(dir, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
      console.error("Le module doit avoir un fichier package.json (dir=" + dir + ")");
      process.exit(1);
  }

  let packageJson = require(packageJsonPath);

  return {
      name: packageJson.name,
      version: packageJson.version,
      dir: dir,
      packageJsonPath: packageJsonPath,
      parent: parent,
      level: parent ? parent.level + 1 : 0
  };
};

module.exports = Directory;
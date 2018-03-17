import { Component, OnInit } from '@angular/core';
import {HeliumService} from "../../service/helium/helium.service";
import {HeliumType} from "./helium-type";
import {ConfirmationService} from "primeng/primeng";

@Component({
  selector: 'app-helium',
  templateUrl: './helium.component.html',
  styleUrls: ['./helium.component.css']
})
export class HeliumComponent implements OnInit {

  min_height = window.innerHeight - 183 + 'px'

  constructor(public heliumService:HeliumService,
              public confirmationService:ConfirmationService) { }

  ngOnInit() {
    this.init()
  }

  pkgSearchResults = {}
  defaultPackages = {}
  showVersions = {}
  bundleOrder = []
  bundleOrderChanged = false
  vizTypePkg = {}
  spellTypePkg = {}
  intpTypePkg = {}
  appTypePkg = {}
  numberOfEachPackageByType = {}
  allPackageTypes = [HeliumType][0]
  pkgListByType = 'VISUALIZATION'
  defaultPackageConfigs // { pkgName, [{name, type, desc, value, defaultValue}] }
  //intpDefaultIcon = $sce.trustAsHtml('<img src="../assets/images/maven_default_icon.png" style="width: 12px"/>')
  intpDefaultIcon = '<img src="../assets/images/maven_default_icon.png" style="width: 12px"/>'

  itemsPerPage
  currentPage
  maxSize

  allTypesOfPkg

  init () {
    let self = this;
    // get all package info and set config
    this.heliumService.getAllPackageInfoAndDefaultPackages()
      .then(({ pkgSearchResults, defaultPackages }) => {
        // pagination
        self.itemsPerPage = 10
        self.currentPage = 1
        self.maxSize = 5

        self.pkgSearchResults = pkgSearchResults
        self.defaultPackages = defaultPackages
        self.classifyPkgType(self.defaultPackages)

        return self.heliumService.getAllPackageConfigs()
      })
      .then(defaultPackageConfigs => {
        self.defaultPackageConfigs = defaultPackageConfigs
        return self.heliumService.getVisualizationPackageOrder()
      })
      .then(visPackageOrder => {
        self.setVisPackageOrder(visPackageOrder)
      })
  }

  setVisPackageOrder(visPackageOrder) {
    this.bundleOrder = visPackageOrder
    this.bundleOrderChanged = false
  }

  orderPackageByPubDate(a, b) {
    if (!a.pkg.published) {
      // Because local registry pkgs don't have 'published' field, put current time instead to show them first
      a.pkg.published = new Date().getTime()
    }

    return new Date(a.pkg.published).getTime() - new Date(b.pkg.published).getTime()
  }

  classifyPkgType(packageInfo) {
    let self = this;
    let allTypesOfPkg = {}
    let vizTypePkg = []
    let spellTypePkg = []
    let intpTypePkg = []
    let appTypePkg = []

    let packageInfoArr = Object.keys(packageInfo).map(key => packageInfo[key])
    packageInfoArr = packageInfoArr.sort(self.orderPackageByPubDate).reverse()

    for (let name in packageInfoArr) {
      let pkgs = packageInfoArr[name]
      let pkgType = pkgs.pkg.type

      switch (pkgType) {
        case HeliumType.VISUALIZATION:
          vizTypePkg.push(pkgs)
          break
        case HeliumType.SPELL:
          spellTypePkg.push(pkgs)
          break
        case HeliumType.INTERPRETER:
          intpTypePkg.push(pkgs)
          break
        case HeliumType.APPLICATION:
          appTypePkg.push(pkgs)
          break
      }
    }

    let pkgsArr = [
      vizTypePkg,
      spellTypePkg,
      intpTypePkg,
      appTypePkg
    ]
    for (let idx in Object.keys(HeliumType)) {
      allTypesOfPkg[Object.keys(HeliumType)[idx]] = pkgsArr[idx]
    }

    self.allTypesOfPkg = allTypesOfPkg
  }

  bundleOrderListeners = {
    accept: function (sourceItemHandleScope, destSortableScope) { return true },
    itemMoved: function (event) {},
    orderChanged: function (event) {
      this.bundleOrderChanged = true
    }
  }

  /*saveBundleOrder() {
    let self = this;

    self.confirmationService.confirm({
      message: 'Save changes?',
      header: '',
      icon: 'fa fa-delete',
      accept: () => {

        confirm.$modalFooter.find('button').addClass('disabled')
        confirm.$modalFooter.find('button:contains("OK")')
          .html('<i class="fa fa-circle-o-notch fa-spin"></i> Enabling')
        self.heliumService.setVisualizationPackageOrder(self.bundleOrder)
          .success(function (data, status) {
            self.setVisPackageOrder(self.bundleOrder)
            confirm.close()
          })
          .error(function (data, status) {
            confirm.close()
            console.log('Failed to save order')
            BootstrapDialog.show({
              title: 'Error on saving order ',
              message: data.message
            })
          })
        return false
      },
      reject: () => {
      }
    });


    const confirm = BootstrapDialog.confirm({
      closable: false,
      closeByBackdrop: false,
      closeByKeyboard: false,
      title: '',
      message: 'Save changes?',
      callback: function (result) {
        if (result) {
          confirm.$modalFooter.find('button').addClass('disabled')
          confirm.$modalFooter.find('button:contains("OK")')
            .html('<i class="fa fa-circle-o-notch fa-spin"></i> Enabling')
          self.heliumService.setVisualizationPackageOrder(self.bundleOrder)
            .success(function (data, status) {
              self.setVisPackageOrder(self.bundleOrder)
              confirm.close()
            })
            .error(function (data, status) {
              confirm.close()
              console.log('Failed to save order')
              BootstrapDialog.show({
                title: 'Error on saving order ',
                message: data.message
              })
            })
          return false
        }
      }
    })
  }

  getLicense(name, artifact) {
    let filteredPkgSearchResults = this.defaultPackages[name].filter(function (p) {
      return p.artifact === artifact
    })

    let license
    if (filteredPkgSearchResults.length === 0) {
      filteredPkgSearchResults = this.pkgSearchResults[name].filter( function (p) {
        return p.pkg.artifact === artifact
      })

      if (filteredPkgSearchResults.length > 0) {
        license = filteredPkgSearchResults[0].pkg.license
      }
    } else {
      license = filteredPkgSearchResults[0].license
    }

    if (!license) {
      license = 'Unknown'
    }
    return license
  }

  getHeliumTypeText(type) {
    if (type === HeliumType.VISUALIZATION) {
      return `<a target="_blank" href="https://zeppelin.apache.org/docs/${$rootScope.zeppelinVersion}/development/helium/writing_visualization.html">${type}</a>` // eslint-disable-line max-len
    } else if (type === HeliumType.SPELL) {
      return `<a target="_blank" href="https://zeppelin.apache.org/docs/${$rootScope.zeppelinVersion}/development/helium/writing_spell.html">${type}</a>` // eslint-disable-line max-len
    } else {
      return type
    }
  }

  enable(name, artifact, type, groupId, description) {
    let self = this;
    let license = self.getLicense(name, artifact)
    let mavenArtifactInfoToHTML = groupId + ':' + artifact.split('@')[0] + ':' + artifact.split('@')[1]
    let zeppelinVersion = $rootScope.zeppelinVersion
    let url = 'https://zeppelin.apache.org/docs/' + zeppelinVersion + '/manual/interpreterinstallation.html'

    let confirm = ''
    if (type === HeliumType.INTERPRETER) {
      confirm = BootstrapDialog.show({
        title: '',
        message: '<p>Below command will download maven artifact ' +
        '<code style="font-size: 11.5px; background-color: #f5f5f5; color: #0a0a0a">' +
        mavenArtifactInfoToHTML + '</code>' +
        ' and all of its transitive dependencies into interpreter/interpreter-name directory.<p>' +
        '<div class="highlight"><pre><code class="text language-text" data-lang="text" style="font-size: 11.5px">' +
        './bin/install-interpreter.sh --name "interpreter-name" --artifact ' +
        mavenArtifactInfoToHTML + ' </code></pre>' +
        '<p>After restart Zeppelin, create interpreter setting and bind it with your note. ' +
        'For more detailed information, see <a target="_blank" href=' +
        url + '>Interpreter Installation.</a></p>'
      })
    } else {
      confirm = BootstrapDialog.confirm({
        closable: false,
        closeByBackdrop: false,
        closeByKeyboard: false,
        title: '<div style="font-weight: 300;">Do you want to enable Helium Package?</div>',
        message:
        '<div style="font-size: 14px; margin-top: 5px;">Artifact</div>' +
        `<div style="color:gray">${artifact}</div>` +
        '<hr style="margin-top: 10px; margin-bottom: 10px;" />' +
        '<div style="font-size: 14px; margin-bottom: 2px;">Type</div>' +
        `<div style="color:gray">${getHeliumTypeText(type)}</div>` +
        '<hr style="margin-top: 10px; margin-bottom: 10px;" />' +
        '<div style="font-size: 14px;">Description</div>' +
        `<div style="color:gray">${description}</div>` +
        '<hr style="margin-top: 10px; margin-bottom: 10px;" />' +
        '<div style="font-size: 14px;">License</div>' +
        `<div style="color:gray">${license}</div>`,
        callback: function (result) {
          if (result) {
            confirm.$modalFooter.find('button').addClass('disabled')
            confirm.$modalFooter.find('button:contains("OK")')
              .html('<i class="fa fa-circle-o-notch fa-spin"></i> Enabling')
            self.heliumService.enable(name, artifact, type).success(function (data, status) {
              self.init()
              confirm.close()
            }).error(function (data, status) {
              confirm.close()
              console.log('Failed to enable package %o %o. %o', name, artifact, data)
              BootstrapDialog.show({
                title: 'Error on enabling ' + name,
                message: data.message
              })
            })
            return false
          }
        }
      })
    }
  }

  disable(name, artifact) {
    let self = this;
    const confirm = BootstrapDialog.confirm({
      closable: false,
      closeByBackdrop: false,
      closeByKeyboard: false,
      title: '<div style="font-weight: 300;">Do you want to disable Helium Package?</div>',
      message: artifact,
      callback: function (result) {
        if (result) {
          confirm.$modalFooter.find('button').addClass('disabled')
          confirm.$modalFooter.find('button:contains("OK")')
            .html('<i class="fa fa-circle-o-notch fa-spin"></i> Disabling')
          self.heliumService.disable(name)
            .success(function (data, status) {
              self.init()
              confirm.close()
            })
            .error(function (data, status) {
              confirm.close()
              console.log('Failed to disable package %o. %o', name, data)
              BootstrapDialog.show({
                title: 'Error on disabling ' + name,
                message: data.message
              })
            })
          return false
        }
      }
    })
  }*/

  toggleVersions(pkgName) {
    if (this.showVersions[pkgName]) {
      this.showVersions[pkgName] = false
    } else {
      this.showVersions[pkgName] = true
    }
  }

  isLocalPackage(pkgSearchResult) {
    const pkg = pkgSearchResult.pkg
    return pkg.artifact && !pkg.artifact.includes('@')
  }

  hasNpmLink(pkgSearchResult) {
    const pkg = pkgSearchResult.pkg
    return (pkg.type === HeliumType.SPELL || pkg.type === HeliumType.VISUALIZATION) &&
      !this.isLocalPackage(pkgSearchResult)
  }

  hasMavenLink(pkgSearchResult) {
    const pkg = pkgSearchResult.pkg
    return (pkg.type === HeliumType.APPLICATION || pkg.type === HeliumType.INTERPRETER) &&
      !this.isLocalPackage(pkgSearchResult)
  }

  /*getPackageSize(pkgSearchResult, targetPkgType) {
    let result = []
    _.map(pkgSearchResult, function (pkg) {
      result.push(_.find(pkg, {type: targetPkgType}))
    })
    return _.compact(result).length
  }*/

  configExists(pkgSearchResult) {
    // helium package config is persisted per version
    return pkgSearchResult.pkg.config && pkgSearchResult.pkg.artifact
  }

  configOpened(pkgSearchResult) {
    return pkgSearchResult.configOpened && !pkgSearchResult.configFetching
  }

  getConfigButtonClass(pkgSearchResult) {
    return (pkgSearchResult.configOpened && pkgSearchResult.configFetching)
      ? 'disabled' : ''
  }

  toggleConfigButton(pkgSearchResult) {
    let self = this;
    if (pkgSearchResult.configOpened) {
      pkgSearchResult.configOpened = false
      return
    }

    const pkg = pkgSearchResult.pkg
    const pkgName = pkg.name
    pkgSearchResult.configFetching = true
    pkgSearchResult.configOpened = true

    this.heliumService.getSinglePackageConfigs(pkg)
      .then(confs => {
        self.defaultPackageConfigs[pkgName] = confs
        pkgSearchResult.configFetching = false
      })
  }

  saveConfig(pkgSearchResult) {
    const pkgName = pkgSearchResult.pkg.name
    const currentConf = this.defaultPackageConfigs[pkgName]

    this.heliumService.saveConfig(pkgSearchResult.pkg, currentConf, () => {
      // close after config is saved
      pkgSearchResult.configOpened = false
    })
  }

  /*getDescriptionText(pkgSearchResult) {
    return $sce.trustAsHtml(pkgSearchResult.pkg.description)
  }*/

}

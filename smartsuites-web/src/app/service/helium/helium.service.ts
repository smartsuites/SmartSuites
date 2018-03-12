import {Injectable} from '@angular/core';
import {BaseUrlService} from "../base-url/base-url.service";
import {HttpClient} from "@angular/common/http";
import {HeliumType} from "../../components/helium/helium-type";

const HeliumConfFieldType = {
  NUMBER: 'number',
  JSON: 'json',
  STRING: 'string',
}

@Injectable()
export class HeliumService {

  //************ Package ************//
  createDefaultPackage(pkgSearchResult, sce?) {
    for (let pkgIdx in pkgSearchResult) {
      const pkg = pkgSearchResult[pkgIdx]
      //pkg.pkg.icon = sce.trustAsHtml(pkg.pkg.icon)
      if (pkg.enabled) {
        pkgSearchResult.splice(pkgIdx, 1)
        return pkg
      }
    }
    // show first available version if package is not enabled
    const result = pkgSearchResult[0]
    pkgSearchResult.splice(0, 1)
    return result
  }

  /**
   * create default packages based on `enabled` field and `latest` version.
   *
   * @param pkgSearchResults
   * @param sce angular `$sce` object
   * @returns {Object} including {name, pkgInfo}
   */
  createDefaultPackages(pkgSearchResults, sce?) {
    const defaultPackages = {}
    // show enabled version if any version of package is enabled
    for (let name in pkgSearchResults) {
      const pkgSearchResult = pkgSearchResults[name]
      //defaultPackages[name] = this.createDefaultPackage(pkgSearchResult, sce)
      defaultPackages[name] = this.createDefaultPackage(pkgSearchResult)
    }

    return defaultPackages
  }

  //************** conf ***************//
  /**
   * @param persisted <Object> including `type`, `description`, `defaultValue` for each conf key
   * @param spec <Object> including `value` for each conf key
   */
  mergePersistedConfWithSpec(persisted, spec) {
    const confs = []

    for (let name in spec) {
      const specField = spec[name]
      const persistedValue = persisted[name]

      const value = (persistedValue) ? persistedValue : specField.defaultValue
      const merged = {
        name: name,
        type: specField.type,
        description: specField.description,
        value: value,
        defaultValue: specField.defaultValue,
      }

      confs.push(merged)
    }

    return confs
  }

  createAllPackageConfigs(defaultPackages, persistedConfs) {
    let packageConfs = {}

    for (let name in defaultPackages) {
      const pkgSearchResult = defaultPackages[name]

      const spec = pkgSearchResult.pkg.config
      if (!spec) {
        continue
      }

      const artifact = pkgSearchResult.pkg.artifact
      if (!artifact) {
        continue
      }

      let persistedConf = {}
      if (persistedConfs[artifact]) {
        persistedConf = persistedConfs[artifact]
      }

      const confs = this.mergePersistedConfWithSpec(persistedConf, spec)
      packageConfs[name] = confs
    }

    return packageConfs
  }

  parseConfigValue(type, stringified) {
    let value = stringified

    try {
      if (HeliumConfFieldType.NUMBER === type) {
        value = parseFloat(stringified)
      } else if (HeliumConfFieldType.JSON === type) {
        value = JSON.parse(stringified)
      }
    } catch (error) {
      // return just the stringified one
      console.error(`Failed to parse conf type ${type}, value ${value}`)
    }

    return value
  }

  /**
   * persist key-value only
   * since other info (e.g type, desc) can be provided by default config
   */
  createPersistableConfig(currentConfs) {
    const filtered = currentConfs.reduce((acc, c) => {
      acc[c.name] = this.parseConfigValue(c.type, c.value)
      return acc
    }, {})

    return filtered
  }


  constructor(private baseUrlSrv: BaseUrlService,
              private httpClient: HttpClient) {
    this.getVisualizationPackageOrder()
  }

  visualizationBundles = []
  visualizationPackageOrder = []
  // name `heliumBundles` should be same as `HeliumBundleFactory.HELIUM_BUNDLES_VAR`
  heliumBundles = []
  // map for `{ magic: interpreter }`
  spellPerMagic = {}
  // map for `{ magic: package-name }`
  pkgNamePerMagic = {}

  /**
   * @param magic {string} e.g `%flowchart`
   * @returns {SpellBase} undefined if magic is not registered
   */
  getSpellByMagic(magic) {
    return this.spellPerMagic[magic]
  }

  executeSpell(magic, textWithoutMagic) {
    const promisedConf = this.getSinglePackageConfigUsingMagic(magic)
      .then(confs => this.createPersistableConfig(confs))

    return promisedConf.then(conf => {
      const spell = this.getSpellByMagic(magic)
      const spellResult = spell.interpret(textWithoutMagic, conf)
      const parsed = spellResult.getAllParsedDataWithTypes(
        this.spellPerMagic, magic, textWithoutMagic)

      return parsed
    })
  }

  executeSpellAsDisplaySystem(magic, textWithoutMagic) {
    const promisedConf = this.getSinglePackageConfigUsingMagic(magic)
      .then(confs => this.createPersistableConfig(confs))

    return promisedConf.then(conf => {
      const spell = this.getSpellByMagic(magic)
      const spellResult = spell.interpret(textWithoutMagic.trim(), conf)
      const parsed = spellResult.getAllParsedDataWithTypes(this.spellPerMagic)

      return parsed
    })
  }

  getVisualizationCachedPackages() {
    return this.visualizationBundles
  }

  getVisualizationCachedPackageOrder() {
    return this.visualizationPackageOrder
  }

  /**
   * @returns {Promise} which returns bundleOrder and cache it in `visualizationPackageOrder`
   */
  getVisualizationPackageOrder() {
    let self = this;
    return this.httpClient.get(this.baseUrlSrv.getRestApiBase() + '/helium/order/visualization')
      .subscribe(
        response => {
          const order = response['body']
          self.visualizationPackageOrder = order
          return order
        },
        errorResponse => {
          console.error('Can not get bundle order', errorResponse)
        }
      );
  }

  setVisualizationPackageOrder(list) {
    return this.httpClient.post(this.baseUrlSrv.getRestApiBase() + '/helium/order/visualization', list)
  }

  enable(name, artifact) {
    return this.httpClient.post(this.baseUrlSrv.getRestApiBase() + '/helium/enable/' + name, artifact)
  }

  disable(name) {
    return this.httpClient.post(this.baseUrlSrv.getRestApiBase() + '/helium/disable/' + name, null)
  }

  saveConfig(pkg, defaultPackageConfig, closeConfigPanelCallback) {
    // in case of local package, it will include `/`
    const pkgArtifact = encodeURIComponent(pkg.artifact)
    const pkgName = pkg.name
    const filtered = this.createPersistableConfig(defaultPackageConfig)

    if (!pkgName || !pkgArtifact || !filtered) {
      console.error(
        `Can't save config for helium package '${pkgArtifact}'`, filtered)
      return
    }

    const url = `${this.baseUrlSrv.getRestApiBase()}/helium/config/${pkgName}/${pkgArtifact}`
    return this.httpClient.post(url, filtered)
      .subscribe(
        response => {
          if (closeConfigPanelCallback) {
            closeConfigPanelCallback()
          }
        },
        errorResponse => {
          console.error(`Failed to save config for ${pkgArtifact}`, errorResponse)
        }
      );
  }

  /**
   * @returns {Promise<Object>} which including {name, Array<package info for artifact>}
   */
  getAllPackageInfo() {
    return this.httpClient.get(`${this.baseUrlSrv.getRestApiBase()}/helium/package`).toPromise()
      .then((response) => {
        return response['body']
      })
      .catch(function (error) {
        console.error('Failed to get all package infos', error)
      })
  }

  getAllEnabledPackages() {
    return this.httpClient.get(`${this.baseUrlSrv.getRestApiBase()}/helium/enabledPackage`).toPromise()
      .then((response) =>{
        return response['body']
      })
  }

  getSingleBundle(pkgName) {
    let url = `${this.baseUrlSrv.getRestApiBase()}/helium/bundle/load/${pkgName}`
    /*if (process.env.HELIUM_BUNDLE_DEV) {
      url = url + '?refresh=true'
    }*/

    return this.httpClient.get(url)
      .subscribe(
        response => {
          const bundle = response['body']
          if (bundle.substring(0, 'ERROR:'.length) === 'ERROR:') {
            console.error(`Failed to get bundle: ${pkgName}`, bundle)
            return '' // empty bundle will be filtered later
          }

          return bundle
        },
        errorResponse => {
          console.error(`Failed to get single bundle: ${pkgName}`, errorResponse)
        }
      );
  }

  getDefaultPackages() {
    let pkgSearchResults = this.getAllPackageInfo()
    //return this.createDefaultPackages(pkgSearchResults, $sce)
    return this.createDefaultPackages(pkgSearchResults)
  }

  getAllPackageInfoAndDefaultPackages() {
    let self = this;
    return this.getAllPackageInfo()
      .then(pkgSearchResults => {
        return {
          pkgSearchResults: pkgSearchResults,
          defaultPackages: self.createDefaultPackages(pkgSearchResults)
          //defaultPackages: self.createDefaultPackages(pkgSearchResults, $sce),
        }
      })
  }

  /**
   * get all package configs.
   * @return { Promise<{name, Array<Object>}> }
   */
  getAllPackageConfigs() {
    const promisedDefaultPackages = this.getDefaultPackages()
    const promisedPersistedConfs =
      this.httpClient.get(`${this.baseUrlSrv.getRestApiBase()}/helium/config`)
        .subscribe(
          response => {
            return response['body']
          },
          errorResponse => {
            console.error(`error`, errorResponse)
          }
        );


    return Promise.all([promisedDefaultPackages, promisedPersistedConfs])
      .then(values => {
        const defaultPackages = values[0]
        const persistedConfs = values[1]

        return this.createAllPackageConfigs(defaultPackages, persistedConfs)
      })
      .catch(function (error) {
        console.error('Failed to get all package configs', error)
      })
  }

  /**
   * get the package config which is persisted in server.
   * @return { Promise<Array<Object>> }
   */
  getSinglePackageConfigs(pkg) {
    const pkgName = pkg.name
    // in case of local package, it will include `/`
    const pkgArtifact = encodeURIComponent(pkg.artifact)

    if (!pkgName || !pkgArtifact) {
      console.error('Failed to fetch config for\n', pkg)
      return Promise.resolve([])
    }

    const confUrl = `${this.baseUrlSrv.getRestApiBase()}/helium/config/${pkgName}/${pkgArtifact}`
    const promisedConf = this.httpClient.get(confUrl).toPromise()
      .then((response) =>{
        return response['body']
      })

    return promisedConf.then(({confSpec, confPersisted}) => {
      const merged = this.mergePersistedConfWithSpec(confPersisted, confSpec)
      return merged
    })
  }

  getSinglePackageConfigUsingMagic(magic) {
    const pkgName = this.pkgNamePerMagic[magic]

    const confUrl = `${this.baseUrlSrv.getRestApiBase()}/helium/spell/config/${pkgName}`
    const promisedConf = this.httpClient.get(confUrl).toPromise()
      .then((response) =>{
        return response['body']
      })

    return promisedConf.then(({confSpec, confPersisted}) => {
      const merged = this.mergePersistedConfWithSpec(confPersisted, confSpec)
      return merged
    })
  }

  p = this.getAllEnabledPackages()
    .then(enabledPackageSearchResults => {
      const promises = enabledPackageSearchResults.map(packageSearchResult => {
        const pkgName = packageSearchResult.pkg.name
        return this.getSingleBundle(pkgName)
      })

      return Promise.all(promises)
    })
    .then(bundles => {
      return bundles.reduce((acc, b) => {
        // filter out empty bundle
        if (b === '') {
          return acc
        }
        //TODO
        //acc.push(b)
        return acc
      }, [])
    })

  // load should be promise
  load = this.p.then(availableBundles => {
    // evaluate bundles TODO
    /*availableBundles.map(b => {
      // eslint-disable-next-line no-eval
      eval(b)
    })
*/
    // extract bundles by type
    this.heliumBundles.map(b => {
      if (b.type === HeliumType.SPELL) {
        const spell = new b.class() // eslint-disable-line new-cap
        const pkgName = b.id
        this.spellPerMagic[spell.getMagic()] = spell
        this.pkgNamePerMagic[spell.getMagic()] = pkgName
      } else if (b.type === HeliumType.VISUALIZATION) {
        this.visualizationBundles.push(b)
      }
    })
  })

}

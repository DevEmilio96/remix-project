import { IframePlugin, ViewPlugin, WebsocketPlugin } from '@remixproject/engine-web'
import { PluginManagerSettings } from './plugin-manager-settings'
import * as packageJson from '../../../../../package.json'
const yo = require('yo-yo')
const csjs = require('csjs-inject')
const EventEmitter = require('events')
const LocalPlugin = require('./local-plugin')
const addToolTip = require('../ui/tooltip')
const _paq = window._paq = window._paq || []

const css = csjs`
  .pluginSearch {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--light);
    padding: 10px;
    position: sticky;
    top: 0;
    z-index: 2;
    margin-bottom: 0px;
  }
  .pluginSearchInput {
    height: 38px;
  }
  .pluginSearchButton {
    font-size: 13px;
  }
  .displayName {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .pluginIcon {
    height: 0.7rem;
    width: 0.7rem;
    filter: invert(0.5);
  }
  .description {
    font-size: 13px;
    line-height: 18px;
  }
  .descriptiontext {
    display: block;
  }
  .descriptiontext:first-letter {
    text-transform: uppercase;
  }
  .row {
    display: flex;
    flex-direction: row;
  }
  .isStuck {
    background-color: var(--primary);
    color: 
  }
  .versionWarning {
    padding: 4px;
    margin: 0 8px;
    font-weight: 700;
    font-size: 9px;
    line-height: 12px;
    text-transform: uppercase;
    cursor: default;
    border: 1px solid;
    border-radius: 2px;
  }
`

const profile = {
  name: 'pluginManager',
  displayName: 'Plugin manager',
  methods: [],
  events: [],
  icon: 'assets/img/pluginManager.webp',
  description: 'Start/stop services, modules and plugins',
  kind: 'settings',
  location: 'sidePanel',
  documentation: 'https://remix-ide.readthedocs.io/en/latest/plugin_manager.html',
  version: packageJson.version
}

class PluginManagerComponent extends ViewPlugin {
  constructor (appManager, engine) {
    super(profile)
    this.event = new EventEmitter()
    this.appManager = appManager
    this.views = {
      root: null,
      items: {}
    }
    this.localPlugin = new LocalPlugin()
    this.filter = ''
    this.appManager.event.on('activate', () => { this.reRender() })
    this.appManager.event.on('deactivate', () => { this.reRender() })
    this.engine = engine
    this.engine.event.on('onRegistration', () => { this.reRender() })
  }

  isActive (name) {
    return this.appManager.actives.includes(name)
  }

  activateP (name) {
    this.appManager.activatePlugin(name)
    _paq.push(['trackEvent', 'manager', 'activate', name])
  }

  deactivateP (name) {
    this.call('manager', 'deactivatePlugin', name)
    _paq.push(['trackEvent', 'manager', 'deactivate', name])
  }

  renderItem (profile) {
    const displayName = (profile.displayName) ? profile.displayName : profile.name

    // Check version of the plugin
    let versionWarning
    // Alpha
    if (profile.version && profile.version.match(/\b(\w*alpha\w*)\b/g)) {
      versionWarning = yo`<small title="Version Alpha" class="${css.versionWarning} plugin-version">alpha</small>`
    }
    // Beta
    if (profile.version && profile.version.match(/\b(\w*beta\w*)\b/g)) {
      versionWarning = yo`<small title="Version Beta" class="${css.versionWarning} plugin-version">beta</small>`
    }

    const activationButton = this.isActive(profile.name)
      ? yo`
      <button
        onclick="${() => this.deactivateP(profile.name)}"
        class="btn btn-secondary btn-sm" data-id="pluginManagerComponentDeactivateButton${profile.name}"
      >
        Deactivate
      </button>
      `
      : yo`
      <button
        onclick="${() => this.activateP(profile.name)}"
        class="btn btn-success btn-sm" data-id="pluginManagerComponentActivateButton${profile.name}"
      >
        Activate
      </button>`

    return yo`
      <article id="remixPluginManagerListItem_${profile.name}" class="list-group-item py-1 mb-1 plugins-list-group-item" title="${displayName}" >
        <div class="${css.row} justify-content-between align-items-center mb-2">
          <h6 class="${css.displayName} plugin-name">
            ${displayName}
            ${versionWarning}
            ${activationButton}
          </h6>
        </div>
        <div class="${css.description} d-flex text-body plugin-text mb-2">
          <img src="${profile.icon}" class="mr-1 mt-1 ${css.pluginIcon}" />
          <span class="${css.descriptiontext}">${profile.description}</span>
        </div>
      </article>
    `
  }

  /***************
   * SUB-COMPONENT
   */
  /**
   * Add a local plugin to the list of plugins
   */
  async openLocalPlugin () {
    try {
      const profile = await this.localPlugin.open(this.appManager.getAll())
      if (!profile) return
      if (this.appManager.getIds().includes(profile.name)) {
        throw new Error('This name has already been used')
      }
      const plugin = profile.type === 'iframe' ? new IframePlugin(profile) : new WebsocketPlugin(profile)
      this.engine.register(plugin)
      await this.appManager.activatePlugin(plugin.name)
    } catch (err) {
      // TODO : Use an alert to handle this error instead of a console.log
      console.log(`Cannot create Plugin : ${err.message}`)
      addToolTip(`Cannot create Plugin : ${err.message}`)
    }
  }

  render () {
    // Filtering helpers
    const isFiltered = (profile) => (profile.displayName ? profile.displayName : profile.name).toLowerCase().includes(this.filter)
    const isNotRequired = (profile) => !this.appManager.isRequired(profile.name)
    const isNotDependent = (profile) => !this.appManager.isDependent(profile.name)
    const isNotHome = (profile) => profile.name !== 'home'
    const sortByName = (profileA, profileB) => {
      const nameA = ((profileA.displayName) ? profileA.displayName : profileA.name).toUpperCase()
      const nameB = ((profileB.displayName) ? profileB.displayName : profileB.name).toUpperCase()
      return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0
    }

    // Filter all active and inactive modules that are not required
    const { actives, inactives } = this.appManager.getAll()
      .filter(isFiltered)
      .filter(isNotRequired)
      .filter(isNotDependent)
      .filter(isNotHome)
      .sort(sortByName)
      .reduce(({ actives, inactives }, profile) => {
        return this.isActive(profile.name)
          ? { actives: [...actives, profile], inactives }
          : { inactives: [...inactives, profile], actives }
      }, { actives: [], inactives: [] })

    const activeTile = actives.length !== 0
      ? yo`
      <nav class="plugins-list-header justify-content-between navbar navbar-expand-lg bg-light navbar-light align-items-center">
        <span class="navbar-brand plugins-list-title">Active Modules</span>
        <span class="badge badge-primary" data-id="pluginManagerComponentActiveTilesCount">${actives.length}</span>
      </nav>`
      : ''
    const inactiveTile = inactives.length !== 0
      ? yo`
      <nav class="plugins-list-header justify-content-between navbar navbar-expand-lg bg-light navbar-light align-items-center">
        <span class="navbar-brand plugins-list-title h6 mb-0 mr-2">Inactive Modules</span>
        <span class="badge badge-primary" style = "cursor: default;" data-id="pluginManagerComponentInactiveTilesCount">${inactives.length}</span>
      </nav>`
      : ''

    const settings = new PluginManagerSettings().render()

    const rootView = yo`
      <div id='pluginManager' data-id="pluginManagerComponentPluginManager">
        <header class="form-group ${css.pluginSearch} plugins-header py-3 px-4 border-bottom" data-id="pluginManagerComponentPluginManagerHeader">
          <input onkeyup="${e => this.filterPlugins(e)}" class="${css.pluginSearchInput} form-control" placeholder="Search" data-id="pluginManagerComponentSearchInput">
          <button onclick="${_ => this.openLocalPlugin()}" class="${css.pluginSearchButton} btn bg-transparent text-dark border-0 mt-2 text-underline" data-id="pluginManagerComponentPluginSearchButton">
            Connect to a Local Plugin
          </button>
        </header>
        <section data-id="pluginManagerComponentPluginManagerSection">
          ${activeTile}
          <div class="list-group list-group-flush plugins-list-group" data-id="pluginManagerComponentActiveTile">
            ${actives.map(profile => this.renderItem(profile))}
          </div>
          ${inactiveTile}
          <div class="list-group list-group-flush plugins-list-group" data-id="pluginManagerComponentInactiveTile">
            ${inactives.map(profile => this.renderItem(profile))}
          </div>
        </section>
        ${settings}
      </div>
    `
    if (!this.views.root) this.views.root = rootView
    return rootView
  }

  reRender () {
    if (this.views.root) {
      yo.update(this.views.root, this.render())
    }
  }

  filterPlugins ({ target }) {
    this.filter = target.value.toLowerCase()
    this.reRender()
  }
}

module.exports = PluginManagerComponent

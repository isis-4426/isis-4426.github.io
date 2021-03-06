import { __awaiter } from "tslib";
import * as d3 from 'd3-selection';
import deepmerge from 'deepmerge';
import stringify from 'json-stringify-pretty-compact';
import { satisfies } from 'semver';
import * as vegaImport from 'vega';
import { isBoolean } from 'vega';
import * as vegaLiteImport from 'vega-lite';
import schemaParser from 'vega-schema-url-parser';
import * as themes from 'vega-themes';
import { Handler } from 'vega-tooltip';
import post from './post';
import embedStyle from './style';
export const vega = vegaImport;
export let vegaLite = vegaLiteImport;
// For backwards compatibility with Vega-Lite before v4.
const w = window;
if (vegaLite === undefined && w['vl'] && w['vl'].compile) {
    vegaLite = w['vl'];
}
const I18N = {
    CLICK_TO_VIEW_ACTIONS: 'Click to view actions',
    COMPILED_ACTION: 'View Compiled Vega',
    EDITOR_ACTION: 'Open in Vega Editor',
    PNG_ACTION: 'Save as PNG',
    SOURCE_ACTION: 'View Source',
    SVG_ACTION: 'Save as SVG'
};
const NAMES = {
    vega: 'Vega',
    'vega-lite': 'Vega-Lite'
};
const VERSION = {
    vega: vega.version,
    'vega-lite': vegaLite ? vegaLite.version : 'not available'
};
const PREPROCESSOR = {
    vega: vgSpec => vgSpec,
    'vega-lite': (vlSpec, config) => vegaLite.compile(vlSpec, { config: config }).spec
};
const SVG_CIRCLES = `
<svg viewBox="0 0 16 16" fill="currentColor" stroke="none" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
  <circle r="2" cy="8" cx="2"></circle>
  <circle r="2" cy="8" cx="8"></circle>
  <circle r="2" cy="8" cx="14"></circle>
</svg>`;
function isTooltipHandler(h) {
    return typeof h === 'function';
}
function viewSource(source, sourceHeader, sourceFooter, mode) {
    const header = `<html><head>${sourceHeader}</head><body><pre><code class="json">`;
    const footer = `</code></pre>${sourceFooter}</body></html>`;
    const win = window.open('');
    win.document.write(header + source + footer);
    win.document.title = `${NAMES[mode]} JSON Source`;
}
/**
 * Try to guess the type of spec.
 *
 * @param spec Vega or Vega-Lite spec.
 */
export function guessMode(spec, providedMode) {
    // Decide mode
    if (spec.$schema) {
        const parsed = schemaParser(spec.$schema);
        if (providedMode && providedMode !== parsed.library) {
            console.warn(`The given visualization spec is written in ${NAMES[parsed.library]}, but mode argument sets ${NAMES[providedMode] || providedMode}.`);
        }
        const mode = parsed.library;
        if (!satisfies(VERSION[mode], `^${parsed.version.slice(1)}`)) {
            console.warn(`The input spec uses ${NAMES[mode]} ${parsed.version}, but the current version of ${NAMES[mode]} is v${VERSION[mode]}.`);
        }
        return mode;
    }
    // try to guess from the provided spec
    if ('mark' in spec ||
        'encoding' in spec ||
        'layer' in spec ||
        'hconcat' in spec ||
        'vconcat' in spec ||
        'facet' in spec ||
        'repeat' in spec) {
        return 'vega-lite';
    }
    if ('marks' in spec || 'signals' in spec || 'scales' in spec || 'axes' in spec) {
        return 'vega';
    }
    return providedMode || 'vega';
}
function isLoader(o) {
    return !!(o && 'load' in o);
}
/**
 * Embed a Vega visualization component in a web page. This function returns a promise.
 *
 * @param el        DOM element in which to place component (DOM node or CSS selector).
 * @param spec      String : A URL string from which to load the Vega specification.
 *                  Object : The Vega/Vega-Lite specification as a parsed JSON object.
 * @param opt       A JavaScript object containing options for embedding.
 */
export default function embed(el, spec, opt = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const loader = isLoader(opt.loader) ? opt.loader : vega.loader(opt.loader);
        // Load the visualization specification.
        if (vega.isString(spec)) {
            const data = yield loader.load(spec);
            return embed(el, JSON.parse(data), opt);
        }
        opt = deepmerge(opt, (spec.usermeta && spec.usermeta['embedOptions']) || {});
        // Load Vega theme/configuration.
        let config = opt.config || {};
        if (vega.isString(config)) {
            const data = yield loader.load(config);
            return embed(el, spec, Object.assign(Object.assign({}, opt), { config: JSON.parse(data) }));
        }
        const actions = isBoolean(opt.actions)
            ? opt.actions
            : deepmerge({ export: { svg: true, png: true }, source: true, compiled: true, editor: true }, opt.actions || {});
        const i18n = Object.assign(Object.assign({}, I18N), opt.i18n);
        const renderer = opt.renderer || 'canvas';
        const logLevel = opt.logLevel || vega.Warn;
        const downloadFileName = opt.downloadFileName || 'visualization';
        if (opt.defaultStyle !== false) {
            // Add a default stylesheet to the head of the document.
            const ID = 'vega-embed-style';
            if (!document.getElementById(ID)) {
                const style = document.createElement('style');
                style.id = ID;
                style.innerText =
                    opt.defaultStyle === undefined || opt.defaultStyle === true ? (embedStyle || '').toString() : opt.defaultStyle;
                document.head.appendChild(style);
            }
        }
        if (opt.theme) {
            config = deepmerge(themes[opt.theme], config);
        }
        const mode = guessMode(spec, opt.mode);
        let vgSpec = PREPROCESSOR[mode](spec, config);
        if (mode === 'vega-lite') {
            if (vgSpec.$schema) {
                const parsed = schemaParser(vgSpec.$schema);
                if (!satisfies(VERSION.vega, `^${parsed.version.slice(1)}`)) {
                    console.warn(`The compiled spec uses Vega ${parsed.version}, but current version is v${VERSION.vega}.`);
                }
            }
        }
        // ensure container div has class 'vega-embed'
        const div = d3
            .select(el) // d3.select supports elements and strings
            .classed('vega-embed', true)
            .html(''); // clear container
        const patch = opt.patch;
        if (patch) {
            if (patch instanceof Function) {
                vgSpec = patch(vgSpec);
            }
            else if (vega.isString(patch)) {
                const patchString = yield loader.load(patch);
                // eslint-disable-next-line require-atomic-updates
                vgSpec = deepmerge(vgSpec, JSON.parse(patchString));
            }
            else {
                vgSpec = deepmerge(vgSpec, patch);
            }
        }
        // Do not apply the config to Vega when we have already applied it to Vega-Lite.
        // This call may throw an Error if parsing fails.
        const runtime = vega.parse(vgSpec, mode === 'vega-lite' ? {} : config);
        const view = new vega.View(runtime, {
            loader,
            logLevel,
            renderer
        });
        if (opt.tooltip !== false) {
            let handler;
            if (isTooltipHandler(opt.tooltip)) {
                handler = opt.tooltip;
            }
            else {
                // user provided boolean true or tooltip options
                handler = new Handler(opt.tooltip === true ? {} : opt.tooltip).call;
            }
            view.tooltip(handler);
        }
        let { hover } = opt;
        if (hover === undefined) {
            hover = mode === 'vega';
        }
        if (hover) {
            const { hoverSet, updateSet } = (typeof hover === 'boolean' ? {} : hover);
            view.hover(hoverSet, updateSet);
        }
        if (opt) {
            if (opt.width) {
                view.width(opt.width);
            }
            if (opt.height) {
                view.height(opt.height);
            }
            if (opt.padding) {
                view.padding(opt.padding);
            }
        }
        yield view.initialize(el).runAsync();
        if (actions !== false) {
            let wrapper = div;
            if (opt.defaultStyle !== false) {
                const details = div.append('details').attr('title', i18n.CLICK_TO_VIEW_ACTIONS);
                wrapper = details;
                const summary = details.insert('summary');
                summary.html(SVG_CIRCLES);
                const dn = details.node();
                document.addEventListener('click', evt => {
                    if (!dn.contains(evt.target)) {
                        dn.removeAttribute('open');
                    }
                });
            }
            const ctrl = wrapper.insert('div').attr('class', 'vega-actions');
            // add 'Export' action
            if (actions === true || actions.export !== false) {
                for (const ext of ['svg', 'png']) {
                    if (actions === true || actions.export === true || actions.export[ext]) {
                        const i18nExportAction = i18n[`${ext.toUpperCase()}_ACTION`];
                        ctrl
                            .append('a')
                            .text(i18nExportAction)
                            .attr('href', '#')
                            .attr('target', '_blank')
                            .attr('download', `${downloadFileName}.${ext}`)
                            // eslint-disable-next-line func-names
                            .on('mousedown', function () {
                            view
                                .toImageURL(ext, opt.scaleFactor)
                                .then(url => {
                                this.href = url;
                            })
                                .catch(error => {
                                throw error;
                            });
                            d3.event.preventDefault();
                        });
                    }
                }
            }
            // add 'View Source' action
            if (actions === true || actions.source !== false) {
                ctrl
                    .append('a')
                    .text(i18n.SOURCE_ACTION)
                    .attr('href', '#')
                    .on('mousedown', () => {
                    viewSource(stringify(spec), opt.sourceHeader || '', opt.sourceFooter || '', mode);
                    d3.event.preventDefault();
                });
            }
            // add 'View Compiled' action
            if (mode === 'vega-lite' && (actions === true || actions.compiled !== false)) {
                ctrl
                    .append('a')
                    .text(i18n.COMPILED_ACTION)
                    .attr('href', '#')
                    .on('mousedown', () => {
                    viewSource(stringify(vgSpec), opt.sourceHeader || '', opt.sourceFooter || '', 'vega');
                    d3.event.preventDefault();
                });
            }
            // add 'Open in Vega Editor' action
            if (actions === true || actions.editor !== false) {
                const editorUrl = opt.editorUrl || 'https://vega.github.io/editor/';
                ctrl
                    .append('a')
                    .text(i18n.EDITOR_ACTION)
                    .attr('href', '#')
                    .on('mousedown', () => {
                    post(window, editorUrl, {
                        config: config,
                        mode,
                        renderer,
                        spec: stringify(spec)
                    });
                    d3.event.preventDefault();
                });
            }
        }
        return { view, spec, vgSpec };
    });
}
//# sourceMappingURL=embed.js.map
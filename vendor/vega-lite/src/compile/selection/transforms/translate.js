import { selector as parseSelector } from 'vega-event-selector';
import { X, Y } from '../../../channel';
import { BRUSH as INTERVAL_BRUSH } from '../interval';
import scalesCompiler, { domain } from './scales';
const ANCHOR = '_translate_anchor';
const DELTA = '_translate_delta';
const translate = {
    has: selCmpt => {
        return selCmpt.type === 'interval' && selCmpt.translate;
    },
    signals: (model, selCmpt, signals) => {
        const name = selCmpt.name;
        const hasScales = scalesCompiler.has(selCmpt);
        const anchor = name + ANCHOR;
        const { x, y } = selCmpt.project.has;
        let events = parseSelector(selCmpt.translate, 'scope');
        if (!hasScales) {
            events = events.map(e => ((e.between[0].markname = name + INTERVAL_BRUSH), e));
        }
        signals.push({
            name: anchor,
            value: {},
            on: [
                {
                    events: events.map(e => e.between[0]),
                    update: '{x: x(unit), y: y(unit)' +
                        (x !== undefined ? ', extent_x: ' + (hasScales ? domain(model, X) : `slice(${x.signals.visual})`) : '') +
                        (y !== undefined ? ', extent_y: ' + (hasScales ? domain(model, Y) : `slice(${y.signals.visual})`) : '') +
                        '}'
                }
            ]
        }, {
            name: name + DELTA,
            value: {},
            on: [
                {
                    events: events,
                    update: `{x: ${anchor}.x - x(unit), y: ${anchor}.y - y(unit)}`
                }
            ]
        });
        if (x !== undefined) {
            onDelta(model, selCmpt, x, 'width', signals);
        }
        if (y !== undefined) {
            onDelta(model, selCmpt, y, 'height', signals);
        }
        return signals;
    }
};
export default translate;
function onDelta(model, selCmpt, proj, size, signals) {
    var _a;
    const name = selCmpt.name;
    const anchor = name + ANCHOR;
    const delta = name + DELTA;
    const channel = proj.channel;
    const hasScales = scalesCompiler.has(selCmpt);
    const signal = signals.filter(s => s.name === proj.signals[hasScales ? 'data' : 'visual'])[0];
    const sizeSg = model.getSizeSignalRef(size).signal;
    const scaleCmpt = model.getScaleComponent(channel);
    const scaleType = scaleCmpt.get('type');
    const sign = hasScales && channel === X ? '-' : ''; // Invert delta when panning x-scales.
    const extent = `${anchor}.extent_${channel}`;
    const offset = `${sign}${delta}.${channel} / ` + (hasScales ? `${sizeSg}` : `span(${extent})`);
    const panFn = !hasScales
        ? 'panLinear'
        : scaleType === 'log'
            ? 'panLog'
            : scaleType === 'pow'
                ? 'panPow'
                : 'panLinear';
    const update = `${panFn}(${extent}, ${offset}` +
        (hasScales && scaleType === 'pow' ? `, ${_a = scaleCmpt.get('exponent'), (_a !== null && _a !== void 0 ? _a : 1)}` : '') +
        ')';
    signal.on.push({
        events: { signal: delta },
        update: hasScales ? update : `clampRange(${update}, 0, ${sizeSg})`
    });
}
//# sourceMappingURL=translate.js.map
import { selector as parseSelector } from 'vega-event-selector';
import { stringValue } from 'vega-util';
import { X, Y } from '../../../channel';
import { BRUSH as INTERVAL_BRUSH } from '../interval';
import { default as scalesCompiler, domain } from './scales';
const ANCHOR = '_zoom_anchor';
const DELTA = '_zoom_delta';
const zoom = {
    has: selCmpt => {
        return selCmpt.type === 'interval' && selCmpt.zoom;
    },
    signals: (model, selCmpt, signals) => {
        const name = selCmpt.name;
        const hasScales = scalesCompiler.has(selCmpt);
        const delta = name + DELTA;
        const { x, y } = selCmpt.project.has;
        const sx = stringValue(model.scaleName(X));
        const sy = stringValue(model.scaleName(Y));
        let events = parseSelector(selCmpt.zoom, 'scope');
        if (!hasScales) {
            events = events.map(e => ((e.markname = name + INTERVAL_BRUSH), e));
        }
        signals.push({
            name: name + ANCHOR,
            on: [
                {
                    events: events,
                    update: !hasScales
                        ? `{x: x(unit), y: y(unit)}`
                        : '{' +
                            [sx ? `x: invert(${sx}, x(unit))` : '', sy ? `y: invert(${sy}, y(unit))` : '']
                                .filter(expr => !!expr)
                                .join(', ') +
                            '}'
                }
            ]
        }, {
            name: delta,
            on: [
                {
                    events: events,
                    force: true,
                    update: 'pow(1.001, event.deltaY * pow(16, event.deltaMode))'
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
export default zoom;
function onDelta(model, selCmpt, proj, size, signals) {
    var _a;
    const name = selCmpt.name;
    const channel = proj.channel;
    const hasScales = scalesCompiler.has(selCmpt);
    const signal = signals.filter(s => s.name === proj.signals[hasScales ? 'data' : 'visual'])[0];
    const sizeSg = model.getSizeSignalRef(size).signal;
    const scaleCmpt = model.getScaleComponent(channel);
    const scaleType = scaleCmpt.get('type');
    const base = hasScales ? domain(model, channel) : signal.name;
    const delta = name + DELTA;
    const anchor = `${name}${ANCHOR}.${channel}`;
    const zoomFn = !hasScales
        ? 'zoomLinear'
        : scaleType === 'log'
            ? 'zoomLog'
            : scaleType === 'pow'
                ? 'zoomPow'
                : 'zoomLinear';
    const update = `${zoomFn}(${base}, ${anchor}, ${delta}` +
        (hasScales && scaleType === 'pow' ? `, ${_a = scaleCmpt.get('exponent'), (_a !== null && _a !== void 0 ? _a : 1)}` : '') +
        ')';
    signal.on.push({
        events: { signal: delta },
        update: hasScales ? update : `clampRange(${update}, 0, ${sizeSg})`
    });
}
//# sourceMappingURL=zoom.js.map
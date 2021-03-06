import { getMarkConfig } from '../common';
import * as mixins from './mixins';
import * as ref from './valueref';
export const text = {
    vgMark: 'text',
    encodeEntry: (model) => {
        const { config, encoding, width, height } = model;
        return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, mixins.baseEncodeEntry(model, {
            align: 'include',
            baseline: 'include',
            color: 'include',
            size: 'ignore',
            orient: 'ignore'
        })), mixins.pointPosition('x', model, ref.mid(width))), mixins.pointPosition('y', model, ref.mid(height))), mixins.text(model)), mixins.nonPosition('size', model, {
            vgChannel: 'fontSize' // VL's text size is fontSize
        })), mixins.valueIfDefined('align', align(model.markDef, encoding, config))), mixins.valueIfDefined('baseline', baseline(model.markDef, encoding, config)));
    }
};
function align(markDef, encoding, config) {
    var _a;
    const a = (_a = markDef.align, (_a !== null && _a !== void 0 ? _a : getMarkConfig('align', markDef, config)));
    if (a === undefined) {
        return 'center';
    }
    // If there is a config, Vega-parser will process this already.
    return undefined;
}
function baseline(markDef, encoding, config) {
    var _a;
    const b = (_a = markDef.baseline, (_a !== null && _a !== void 0 ? _a : getMarkConfig('baseline', markDef, config)));
    if (b === undefined) {
        return 'middle';
    }
    // If there is a config, Vega-parser will process this already.
    return undefined;
}
//# sourceMappingURL=text.js.map
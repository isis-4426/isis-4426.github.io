import { __rest } from "tslib";
import { keys, replaceAll, stringify, vals } from '../../util';
import { isSignalRef } from '../../vega.schema';
import { mergeLegendComponent } from './parse';
function setLegendEncode(legend, part, vgProp, vgRef) {
    var _a, _b, _c;
    legend.encode = (_a = legend.encode, (_a !== null && _a !== void 0 ? _a : {}));
    legend.encode[part] = (_b = legend.encode[part], (_b !== null && _b !== void 0 ? _b : {}));
    legend.encode[part].update = (_c = legend.encode[part].update, (_c !== null && _c !== void 0 ? _c : {}));
    // TODO: remove as any after https://github.com/prisma/nexus-prisma/issues/291
    legend.encode[part].update[vgProp] = vgRef;
}
export function assembleLegends(model) {
    const legendComponentIndex = model.component.legends;
    const legendByDomain = {};
    for (const channel of keys(legendComponentIndex)) {
        const scaleComponent = model.getScaleComponent(channel);
        const domainHash = stringify(scaleComponent.get('domains'));
        if (legendByDomain[domainHash]) {
            for (const mergedLegendComponent of legendByDomain[domainHash]) {
                const merged = mergeLegendComponent(mergedLegendComponent, legendComponentIndex[channel]);
                if (!merged) {
                    // If cannot merge, need to add this legend separately
                    legendByDomain[domainHash].push(legendComponentIndex[channel]);
                }
            }
        }
        else {
            legendByDomain[domainHash] = [legendComponentIndex[channel].clone()];
        }
    }
    return vals(legendByDomain)
        .flat()
        .map((legendCmpt) => {
        var _a, _b, _c;
        const _d = legendCmpt.combine(), { labelExpr } = _d, legend = __rest(_d, ["labelExpr"]);
        if ((_a = legend.encode) === null || _a === void 0 ? void 0 : _a.symbols) {
            const out = legend.encode.symbols.update;
            if (out.fill && out.fill['value'] !== 'transparent' && !out.stroke && !legend.stroke) {
                // For non color channel's legend, we need to override symbol stroke config from Vega config if stroke channel is not used.
                out.stroke = { value: 'transparent' };
            }
            if (legend.fill) {
                // If top-level fill is defined, for non color channel's legend, we need remove fill.
                delete out.fill;
            }
        }
        if (labelExpr !== undefined) {
            let expr = labelExpr;
            if (((_c = (_b = legend.encode) === null || _b === void 0 ? void 0 : _b.labels) === null || _c === void 0 ? void 0 : _c.update) && isSignalRef(legend.encode.labels.update.text)) {
                expr = replaceAll(labelExpr, 'datum.label', legend.encode.labels.update.text.signal);
            }
            setLegendEncode(legend, 'labels', 'text', { signal: expr });
        }
        return legend;
    });
}
//# sourceMappingURL=assemble.js.map
import { __rest } from "tslib";
import { keys } from '../../util';
import { isVgRangeStep } from '../../vega.schema';
import { isConcatModel, isLayerModel, isRepeatModel } from '../model';
import { assembleSelectionScaleDomain } from '../selection/assemble';
import { assembleDomain } from './domain';
export function assembleScales(model) {
    if (isLayerModel(model) || isConcatModel(model) || isRepeatModel(model)) {
        // For concat / layer / repeat, include scales of children too
        return model.children.reduce((scales, child) => {
            return scales.concat(assembleScales(child));
        }, assembleScalesForModel(model));
    }
    else {
        // For facet, child scales would not be included in the parent's scope.
        // For unit, there is no child.
        return assembleScalesForModel(model);
    }
}
export function assembleScalesForModel(model) {
    return keys(model.component.scales).reduce((scales, channel) => {
        const scaleComponent = model.component.scales[channel];
        if (scaleComponent.merged) {
            // Skipped merged scales
            return scales;
        }
        const scale = scaleComponent.combine();
        const { name, type, selectionExtent, domains: _d, range: _r } = scale, otherScaleProps = __rest(scale, ["name", "type", "selectionExtent", "domains", "range"]);
        const range = assembleScaleRange(scale.range, name, channel);
        let domainRaw;
        if (selectionExtent) {
            domainRaw = assembleSelectionScaleDomain(model, selectionExtent);
        }
        const domain = assembleDomain(model, channel);
        scales.push(Object.assign(Object.assign(Object.assign(Object.assign({ name,
            type }, (domain ? { domain } : {})), (domainRaw ? { domainRaw } : {})), { range: range }), otherScaleProps));
        return scales;
    }, []);
}
export function assembleScaleRange(scaleRange, scaleName, channel) {
    // add signals to x/y range
    if (channel === 'x' || channel === 'y') {
        if (isVgRangeStep(scaleRange)) {
            // For width/height step, use a signal created in layout assemble instead of a constant step.
            return {
                step: { signal: scaleName + '_step' }
            };
        }
    }
    return scaleRange;
}
//# sourceMappingURL=assemble.js.map
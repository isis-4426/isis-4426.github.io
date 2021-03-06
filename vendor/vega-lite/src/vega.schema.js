import { isArray } from 'vega-util';
import { keys } from './util';
export function isSignalRef(o) {
    return !!o['signal'];
}
export function isVgRangeStep(range) {
    return !!range['step'];
}
export function isDataRefUnionedDomain(domain) {
    if (!isArray(domain)) {
        return 'fields' in domain && !('data' in domain);
    }
    return false;
}
export function isFieldRefUnionDomain(domain) {
    if (!isArray(domain)) {
        return 'fields' in domain && 'data' in domain;
    }
    return false;
}
export function isDataRefDomain(domain) {
    if (!isArray(domain)) {
        return 'field' in domain && 'data' in domain;
    }
    return false;
}
const VG_MARK_CONFIG_INDEX = {
    opacity: 1,
    fill: 1,
    fillOpacity: 1,
    stroke: 1,
    strokeCap: 1,
    strokeWidth: 1,
    strokeOpacity: 1,
    strokeDash: 1,
    strokeDashOffset: 1,
    strokeJoin: 1,
    strokeMiterLimit: 1,
    size: 1,
    shape: 1,
    interpolate: 1,
    tension: 1,
    orient: 1,
    align: 1,
    baseline: 1,
    text: 1,
    dir: 1,
    dx: 1,
    dy: 1,
    ellipsis: 1,
    limit: 1,
    radius: 1,
    theta: 1,
    angle: 1,
    font: 1,
    fontSize: 1,
    fontWeight: 1,
    fontStyle: 1,
    lineBreak: 1,
    lineHeight: 1,
    cursor: 1,
    href: 1,
    tooltip: 1,
    cornerRadius: 1,
    cornerRadiusTopLeft: 1,
    cornerRadiusTopRight: 1,
    cornerRadiusBottomLeft: 1,
    cornerRadiusBottomRight: 1,
    x: 1,
    y: 1,
    x2: 1,
    y2: 1,
    width: 1,
    height: 1,
    aspect: 1
    // commented below are vg channel that do not have mark config.
    // xc'|'yc'
    // clip: 1,
    // endAngle: 1,
    // innerRadius: 1,
    // outerRadius: 1,
    // path: 1,
    // startAngle: 1,
    // url: 1,
};
export const VG_MARK_CONFIGS = keys(VG_MARK_CONFIG_INDEX);
//# sourceMappingURL=vega.schema.js.map
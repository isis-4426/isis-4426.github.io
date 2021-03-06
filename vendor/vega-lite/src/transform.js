import { normalizeLogicalOperand } from './logical';
import { normalizePredicate } from './predicate';
export function isFilter(t) {
    return t['filter'] !== undefined;
}
export function isImputeSequence(t) {
    var _a;
    return ((_a = t) === null || _a === void 0 ? void 0 : _a['stop']) !== undefined;
}
export function isPivot(t) {
    return t['pivot'] !== undefined;
}
export function isDensity(t) {
    return t['density'] !== undefined;
}
export function isQuantile(t) {
    return t['quantile'] !== undefined;
}
export function isRegression(t) {
    return t['regression'] !== undefined;
}
export function isLoess(t) {
    return t['loess'] !== undefined;
}
export function isLookup(t) {
    return t['lookup'] !== undefined;
}
export function isDataLookup(t) {
    return t['lookup'] !== undefined && t['from']['selection'] === undefined;
}
export function isSelectionLookup(t) {
    return t['lookup'] !== undefined && t['from']['selection'] !== undefined;
}
export function isSample(t) {
    return t['sample'] !== undefined;
}
export function isWindow(t) {
    return t['window'] !== undefined;
}
export function isJoinAggregate(t) {
    return t['joinaggregate'] !== undefined;
}
export function isFlatten(t) {
    return t['flatten'] !== undefined;
}
export function isCalculate(t) {
    return t['calculate'] !== undefined;
}
export function isBin(t) {
    return !!t['bin'];
}
export function isImpute(t) {
    return t['impute'] !== undefined;
}
export function isTimeUnit(t) {
    return t['timeUnit'] !== undefined;
}
export function isAggregate(t) {
    return t['aggregate'] !== undefined;
}
export function isStack(t) {
    return t['stack'] !== undefined;
}
export function isFold(t) {
    return t['fold'] !== undefined;
}
export function normalizeTransform(transform) {
    return transform.map(t => {
        if (isFilter(t)) {
            return {
                filter: normalizeLogicalOperand(t.filter, normalizePredicate)
            };
        }
        return t;
    });
}
//# sourceMappingURL=transform.js.map
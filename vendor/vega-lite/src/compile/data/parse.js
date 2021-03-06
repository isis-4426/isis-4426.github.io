import { isGenerator, isGraticuleGenerator, isInlineData, isNamedData, isSequenceGenerator, isUrlData, MAIN, RAW } from '../../data';
import * as log from '../../log';
import { isAggregate, isBin, isCalculate, isDensity, isFilter, isFlatten, isFold, isImpute, isJoinAggregate, isLoess, isLookup, isPivot, isQuantile, isRegression, isSample, isStack, isTimeUnit, isWindow } from '../../transform';
import { deepEqual, mergeDeep } from '../../util';
import { isFacetModel, isLayerModel, isUnitModel } from '../model';
import { requiresSelectionId } from '../selection';
import { materializeSelections } from '../selection/parse';
import { AggregateNode } from './aggregate';
import { BinNode } from './bin';
import { CalculateNode } from './calculate';
import { OutputNode } from './dataflow';
import { DensityTransformNode } from './density';
import { FacetNode } from './facet';
import { FilterNode } from './filter';
import { FilterInvalidNode } from './filterinvalid';
import { FlattenTransformNode } from './flatten';
import { FoldTransformNode } from './fold';
import { getImplicitFromEncoding, getImplicitFromFilterTransform, getImplicitFromSelection, ParseNode } from './formatparse';
import { GeoJSONNode } from './geojson';
import { GeoPointNode } from './geopoint';
import { GraticuleNode } from './graticule';
import { IdentifierNode } from './identifier';
import { ImputeNode } from './impute';
import { AncestorParse } from '.';
import { JoinAggregateTransformNode } from './joinaggregate';
import { makeJoinAggregateFromFacet } from './joinaggregatefacet';
import { LoessTransformNode } from './loess';
import { LookupNode } from './lookup';
import { PivotTransformNode } from './pivot';
import { QuantileTransformNode } from './quantile';
import { RegressionTransformNode } from './regression';
import { SampleTransformNode } from './sample';
import { SequenceNode } from './sequence';
import { SourceNode } from './source';
import { StackNode } from './stack';
import { TimeUnitNode } from './timeunit';
import { WindowTransformNode } from './window';
export function findSource(data, sources) {
    var _a, _b;
    for (const other of sources) {
        const otherData = other.data;
        // if both datasets have a name defined, we cannot merge
        if (data.name && other.hasName() && data.name !== other.dataName) {
            continue;
        }
        // feature and mesh are mutually exclusive
        if (((_a = data['format']) === null || _a === void 0 ? void 0 : _a.mesh) && ((_b = otherData.format) === null || _b === void 0 ? void 0 : _b.feature)) {
            continue;
        }
        if (isInlineData(data) && isInlineData(otherData)) {
            if (deepEqual(data.values, otherData.values)) {
                return other;
            }
        }
        else if (isUrlData(data) && isUrlData(otherData)) {
            if (data.url === otherData.url) {
                return other;
            }
        }
        else if (isNamedData(data)) {
            if (data.name === other.dataName) {
                return other;
            }
        }
    }
    return null;
}
function parseRoot(model, sources) {
    if (model.data || !model.parent) {
        // if the model defines a data source or is the root, create a source node
        if (model.data === null) {
            // data: null means we should ignore the parent's data so we just create a new data source
            const source = new SourceNode([]);
            sources.push(source);
            return source;
        }
        const existingSource = findSource(model.data, sources);
        if (existingSource) {
            if (!isGenerator(model.data)) {
                existingSource.data.format = mergeDeep({}, model.data.format, existingSource.data.format);
            }
            // if the new source has a name but the existing one does not, we can set it
            if (!existingSource.hasName() && model.data.name) {
                existingSource.dataName = model.data.name;
            }
            return existingSource;
        }
        else {
            const source = new SourceNode(model.data);
            sources.push(source);
            return source;
        }
    }
    else {
        // If we don't have a source defined (overriding parent's data), use the parent's facet root or main.
        return model.parent.component.data.facetRoot
            ? model.parent.component.data.facetRoot
            : model.parent.component.data.main;
    }
}
/**
 * Parses a transform array into a chain of connected dataflow nodes.
 */
export function parseTransformArray(head, model, ancestorParse) {
    var _a, _b;
    let lookupCounter = 0;
    for (const t of model.transforms) {
        let derivedType = undefined;
        let transformNode;
        if (isCalculate(t)) {
            transformNode = head = new CalculateNode(head, t);
            derivedType = 'derived';
        }
        else if (isFilter(t)) {
            const implicit = getImplicitFromFilterTransform(t);
            transformNode = head = (_a = ParseNode.makeWithAncestors(head, {}, implicit, ancestorParse), (_a !== null && _a !== void 0 ? _a : head));
            head = new FilterNode(head, model, t.filter);
        }
        else if (isBin(t)) {
            transformNode = head = BinNode.makeFromTransform(head, t, model);
            derivedType = 'number';
        }
        else if (isTimeUnit(t)) {
            derivedType = 'date';
            const parsedAs = ancestorParse.getWithExplicit(t.field);
            // Create parse node because the input to time unit is always date.
            if (parsedAs.value === undefined) {
                head = new ParseNode(head, { [t.field]: derivedType });
                ancestorParse.set(t.field, derivedType, false);
            }
            transformNode = head = TimeUnitNode.makeFromTransform(head, t);
        }
        else if (isAggregate(t)) {
            transformNode = head = AggregateNode.makeFromTransform(head, t);
            derivedType = 'number';
            if (requiresSelectionId(model)) {
                head = new IdentifierNode(head);
            }
        }
        else if (isLookup(t)) {
            transformNode = head = LookupNode.make(head, model, t, lookupCounter++);
            derivedType = 'derived';
        }
        else if (isWindow(t)) {
            transformNode = head = new WindowTransformNode(head, t);
            derivedType = 'number';
        }
        else if (isJoinAggregate(t)) {
            transformNode = head = new JoinAggregateTransformNode(head, t);
            derivedType = 'number';
        }
        else if (isStack(t)) {
            transformNode = head = StackNode.makeFromTransform(head, t);
            derivedType = 'derived';
        }
        else if (isFold(t)) {
            transformNode = head = new FoldTransformNode(head, t);
            derivedType = 'derived';
        }
        else if (isFlatten(t)) {
            transformNode = head = new FlattenTransformNode(head, t);
            derivedType = 'derived';
        }
        else if (isPivot(t)) {
            transformNode = head = new PivotTransformNode(head, t);
            derivedType = 'derived';
        }
        else if (isSample(t)) {
            head = new SampleTransformNode(head, t);
        }
        else if (isImpute(t)) {
            transformNode = head = ImputeNode.makeFromTransform(head, t);
            derivedType = 'derived';
        }
        else if (isDensity(t)) {
            transformNode = head = new DensityTransformNode(head, t);
            derivedType = 'derived';
        }
        else if (isQuantile(t)) {
            transformNode = head = new QuantileTransformNode(head, t);
            derivedType = 'derived';
        }
        else if (isRegression(t)) {
            transformNode = head = new RegressionTransformNode(head, t);
            derivedType = 'derived';
        }
        else if (isLoess(t)) {
            transformNode = head = new LoessTransformNode(head, t);
            derivedType = 'derived';
        }
        else {
            log.warn(log.message.invalidTransformIgnored(t));
            continue;
        }
        if (transformNode && derivedType !== undefined) {
            for (const field of (_b = transformNode.producedFields(), (_b !== null && _b !== void 0 ? _b : []))) {
                ancestorParse.set(field, derivedType, false);
            }
        }
    }
    return head;
}
/*
Description of the dataflow (http://asciiflow.com/):
     +--------+
     | Source |
     +---+----+
         |
         v
     FormatParse
     (explicit)
         |
         v
     Transforms
(Filter, Calculate, Binning, TimeUnit, Aggregate, Window, ...)
         |
         v
     FormatParse
     (implicit)
         |
         v
 Binning (in `encoding`)
         |
         v
 Timeunit (in `encoding`)
         |
         v
Formula From Sort Array
         |
         v
      +--+--+
      | Raw |
      +-----+
         |
         v
  Aggregate (in `encoding`)
         |
         v
  Stack (in `encoding`)
         |
         v
  Invalid Filter
         |
         v
   +----------+
   |   Main   |
   +----------+
         |
         v
     +-------+
     | Facet |----> "column", "column-layout", and "row"
     +-------+
         |
         v
  ...Child data...
*/
export function parseData(model) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    let head = parseRoot(model, model.component.data.sources);
    const { outputNodes, outputNodeRefCounts } = model.component.data;
    const ancestorParse = model.parent ? model.parent.component.data.ancestorParse.clone() : new AncestorParse();
    const data = model.data;
    if (isGenerator(data)) {
        // insert generator transform
        if (isSequenceGenerator(data)) {
            head = new SequenceNode(head, data.sequence);
        }
        else if (isGraticuleGenerator(data)) {
            head = new GraticuleNode(head, data.graticule);
        }
        // no parsing necessary for generator
        ancestorParse.parseNothing = true;
    }
    else if (((_b = (_a = data) === null || _a === void 0 ? void 0 : _a.format) === null || _b === void 0 ? void 0 : _b.parse) === null) {
        // format.parse: null means disable parsing
        ancestorParse.parseNothing = true;
    }
    head = (_c = ParseNode.makeExplicit(head, model, ancestorParse), (_c !== null && _c !== void 0 ? _c : head));
    // Default discrete selections require an identifer transform to
    // uniquely identify data points. Add this transform at the head of
    // the pipeline such that the identifier field is available for all
    // subsequent datasets. During optimization, we will remove this
    // transform if it proves to be unnecessary. Additional identifier
    // transforms will be necessary when new tuples are constructed
    // (e.g., post-aggregation).
    head = new IdentifierNode(head);
    // HACK: This is equivalent for merging bin extent for union scale.
    // FIXME(https://github.com/vega/vega-lite/issues/2270): Correctly merge extent / bin node for shared bin scale
    const parentIsLayer = model.parent && isLayerModel(model.parent);
    if (isUnitModel(model) || isFacetModel(model)) {
        if (parentIsLayer) {
            head = (_d = BinNode.makeFromEncoding(head, model), (_d !== null && _d !== void 0 ? _d : head));
        }
    }
    if (model.transforms.length > 0) {
        head = parseTransformArray(head, model, ancestorParse);
    }
    // create parse nodes for fields that need to be parsed (or flattened) implicitly
    const implicitSelection = getImplicitFromSelection(model);
    const implicitEncoding = getImplicitFromEncoding(model);
    head = (_e = ParseNode.makeWithAncestors(head, {}, Object.assign(Object.assign({}, implicitSelection), implicitEncoding), ancestorParse), (_e !== null && _e !== void 0 ? _e : head));
    if (isUnitModel(model)) {
        head = GeoJSONNode.parseAll(head, model);
        head = GeoPointNode.parseAll(head, model);
    }
    if (isUnitModel(model) || isFacetModel(model)) {
        if (!parentIsLayer) {
            head = (_f = BinNode.makeFromEncoding(head, model), (_f !== null && _f !== void 0 ? _f : head));
        }
        head = (_g = TimeUnitNode.makeFromEncoding(head, model), (_g !== null && _g !== void 0 ? _g : head));
        head = CalculateNode.parseAllForSortIndex(head, model);
    }
    // add an output node pre aggregation
    const rawName = model.getName(RAW);
    const raw = new OutputNode(head, rawName, RAW, outputNodeRefCounts);
    outputNodes[rawName] = raw;
    head = raw;
    if (isUnitModel(model)) {
        const agg = AggregateNode.makeFromEncoding(head, model);
        if (agg) {
            head = agg;
            if (requiresSelectionId(model)) {
                head = new IdentifierNode(head);
            }
        }
        head = (_h = ImputeNode.makeFromEncoding(head, model), (_h !== null && _h !== void 0 ? _h : head));
        head = (_j = StackNode.makeFromEncoding(head, model), (_j !== null && _j !== void 0 ? _j : head));
    }
    if (isUnitModel(model)) {
        head = (_k = FilterInvalidNode.make(head, model), (_k !== null && _k !== void 0 ? _k : head));
    }
    // output node for marks
    const mainName = model.getName(MAIN);
    const main = new OutputNode(head, mainName, MAIN, outputNodeRefCounts);
    outputNodes[mainName] = main;
    head = main;
    if (isUnitModel(model)) {
        materializeSelections(model, main);
    }
    // add facet marker
    let facetRoot = null;
    if (isFacetModel(model)) {
        const facetName = model.getName('facet');
        // Derive new sort index field for facet's sort array
        head = CalculateNode.parseAllForSortIndex(head, model);
        // Derive new aggregate for facet's sort field
        // augment data source with new fields for crossed facet
        head = (_l = makeJoinAggregateFromFacet(head, model.facet), (_l !== null && _l !== void 0 ? _l : head));
        facetRoot = new FacetNode(head, model, facetName, main.getSource());
        outputNodes[facetName] = facetRoot;
        head = facetRoot;
    }
    return Object.assign(Object.assign({}, model.component.data), { outputNodes,
        outputNodeRefCounts,
        raw,
        main,
        facetRoot,
        ancestorParse });
}
//# sourceMappingURL=parse.js.map
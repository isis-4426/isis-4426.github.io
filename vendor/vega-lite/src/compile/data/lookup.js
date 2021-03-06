import { isString, array } from 'vega-util';
import * as log from '../../log';
import { isDataLookup, isSelectionLookup } from '../../transform';
import { duplicate, hash, varName } from '../../util';
import { DataFlowNode, OutputNode } from './dataflow';
import { findSource } from './parse';
import { SourceNode } from './source';
export class LookupNode extends DataFlowNode {
    constructor(parent, transform, secondary) {
        super(parent);
        this.transform = transform;
        this.secondary = secondary;
    }
    clone() {
        return new LookupNode(null, duplicate(this.transform), this.secondary);
    }
    static make(parent, model, transform, counter) {
        var _a;
        const sources = model.component.data.sources;
        let fromOutputNode = null;
        if (isDataLookup(transform)) {
            let fromSource = findSource(transform.from.data, sources);
            if (!fromSource) {
                fromSource = new SourceNode(transform.from.data);
                sources.push(fromSource);
            }
            const fromOutputName = model.getName(`lookup_${counter}`);
            fromOutputNode = new OutputNode(fromSource, fromOutputName, 'lookup', model.component.data.outputNodeRefCounts);
            model.component.data.outputNodes[fromOutputName] = fromOutputNode;
        }
        else if (isSelectionLookup(transform)) {
            const selName = transform.from.selection;
            transform.as = (_a = transform.as, (_a !== null && _a !== void 0 ? _a : selName));
            fromOutputNode = model.getSelectionComponent(varName(selName), selName).materialized;
            if (!fromOutputNode) {
                throw new Error(log.message.noSameUnitLookup(selName));
            }
        }
        return new LookupNode(parent, transform, fromOutputNode.getSource());
    }
    dependentFields() {
        return new Set([this.transform.lookup]);
    }
    producedFields() {
        return new Set(this.transform.as ? array(this.transform.as) : this.transform.from.fields);
    }
    hash() {
        return `Lookup ${hash({ transform: this.transform, secondary: this.secondary })}`;
    }
    assemble() {
        let foreign;
        if (this.transform.from.fields) {
            // lookup a few fields and add create a flat output
            foreign = Object.assign({ values: this.transform.from.fields }, (this.transform.as ? { as: array(this.transform.as) } : {}));
        }
        else {
            // lookup full record and nest it
            let asName = this.transform.as;
            if (!isString(asName)) {
                log.warn(log.message.NO_FIELDS_NEEDS_AS);
                asName = '_lookup';
            }
            foreign = {
                as: [asName]
            };
        }
        return Object.assign(Object.assign({ type: 'lookup', from: this.secondary, key: this.transform.from.key, fields: [this.transform.lookup] }, foreign), (this.transform.default ? { default: this.transform.default } : {}));
    }
}
//# sourceMappingURL=lookup.js.map
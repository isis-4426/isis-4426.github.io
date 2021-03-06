import { LogicalOperand } from '../../logical';
import { Predicate } from '../../predicate';
import { FilterTransform as VgFilterTransform } from 'vega';
import { Model } from '../model';
import { DataFlowNode } from './dataflow';
export declare class FilterNode extends DataFlowNode {
    private readonly model;
    private readonly filter;
    private expr;
    private _dependentFields;
    clone(): FilterNode;
    constructor(parent: DataFlowNode, model: Model, filter: LogicalOperand<Predicate>);
    dependentFields(): Set<string>;
    producedFields(): Set<string>;
    assemble(): VgFilterTransform;
    hash(): string;
}
//# sourceMappingURL=filter.d.ts.map
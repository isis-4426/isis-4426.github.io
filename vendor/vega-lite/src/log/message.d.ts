import { AggregateOp } from 'vega';
import { Aggregate } from '../aggregate';
import { Channel, FacetChannel, GeoPositionChannel, PositionScaleChannel } from '../channel';
import { TypedFieldDef, Value } from '../channeldef';
import { SplitParentProperty } from '../compile/split';
import { CompositeMark } from '../compositemark';
import { ErrorBarCenter, ErrorBarExtent } from '../compositemark/errorbar';
import { DateTime, DateTimeExpr } from '../datetime';
import { Mark } from '../mark';
import { Projection } from '../projection';
import { ScaleType } from '../scale';
import { GenericSpec } from '../spec';
import { Type } from '../type';
import { VgSortField } from '../vega.schema';
/**
 * Collection of all Vega-Lite Error Messages
 */
export declare function invalidSpec(spec: GenericSpec<any, any>): string;
export declare const FIT_NON_SINGLE = "Autosize \"fit\" only works for single views and layered views.";
export declare function containerSizeNonSingle(name: 'width' | 'height'): string;
export declare function containerSizeNotCompatibleWithAutosize(name: 'width' | 'height'): string;
export declare function droppingFit(channel?: PositionScaleChannel): string;
export declare function cannotProjectOnChannelWithoutField(channel: Channel): string;
export declare function nearestNotSupportForContinuous(mark: string): string;
export declare function selectionNotSupported(mark: CompositeMark): string;
export declare function selectionNotFound(name: string): string;
export declare const SCALE_BINDINGS_CONTINUOUS = "Scale bindings are currently only supported for scales with unbinned, continuous domains.";
export declare function noSameUnitLookup(name: string): string;
export declare function noSuchRepeatedValue(field: string): string;
export declare function columnsNotSupportByRowCol(type: 'facet' | 'repeat'): string;
export declare const CONCAT_CANNOT_SHARE_AXIS = "Axes cannot be shared in concatenated views yet (https://github.com/vega/vega-lite/issues/2415).";
export declare const REPEAT_CANNOT_SHARE_AXIS = "Axes cannot be shared in repeated views yet (https://github.com/vega/vega-lite/issues/2415).";
export declare function unrecognizedParse(p: string): string;
export declare function differentParse(field: string, local: string, ancestor: string): string;
export declare function invalidTransformIgnored(transform: any): string;
export declare const NO_FIELDS_NEEDS_AS = "If \"from.fields\" is not specified, \"as\" has to be a string that specifies the key to be used for the data from the secondary source.";
export declare function encodingOverridden(channels: Channel[]): string;
export declare function projectionOverridden(opt: {
    parentProjection: Projection;
    projection: Projection;
}): string;
export declare function primitiveChannelDef(channel: Channel, type: 'string' | 'number' | 'boolean', value: Exclude<Value, null>): string;
export declare function invalidFieldType(type: Type): string;
export declare function nonZeroScaleUsedWithLengthMark(mark: 'bar' | 'area', channel: Channel, opt: {
    scaleType?: ScaleType;
    zeroFalse?: boolean;
}): string;
export declare function invalidFieldTypeForCountAggregate(type: Type, aggregate: Aggregate | string): string;
export declare function invalidAggregate(aggregate: AggregateOp | string): string;
export declare function missingFieldType(channel: Channel, newType: Type): string;
export declare function droppingColor(type: 'encoding' | 'property', opt: {
    fill?: boolean;
    stroke?: boolean;
}): string;
export declare function emptyFieldDef(fieldDef: TypedFieldDef<string>, channel: Channel): string;
export declare function latLongDeprecated(channel: Channel, type: Type, newChannel: GeoPositionChannel): string;
export declare const LINE_WITH_VARYING_SIZE = "Line marks cannot encode size with a non-groupby field. You may want to use trail marks instead.";
export declare function incompatibleChannel(channel: Channel, markOrFacet: Mark | 'facet' | CompositeMark, when?: string): string;
export declare function invalidEncodingChannel(channel: string): string;
export declare function facetChannelShouldBeDiscrete(channel: string): string;
export declare function facetChannelDropped(channels: FacetChannel[]): string;
export declare function discreteChannelCannotEncode(channel: Channel, type: Type): string;
export declare function lineWithRange(hasX2: boolean, hasY2: boolean): string;
export declare function orientOverridden(original: string, actual: string): string;
export declare const CANNOT_UNION_CUSTOM_DOMAIN_WITH_FIELD_DOMAIN = "Custom domain scale cannot be unioned with default field-based domain.";
export declare const RANGE_STEP_DEPRECATED = "Scale's \"rangeStep\" is deprecated and will be removed in Vega-Lite 5.0. Please use \"width\"/\"height\": {\"step\": ...} instead. See https://vega.github.io/vega-lite/docs/size.html.";
export declare function cannotUseScalePropertyWithNonColor(prop: string): string;
export declare function unaggregateDomainHasNoEffectForRawField(fieldDef: TypedFieldDef<string>): string;
export declare function unaggregateDomainWithNonSharedDomainOp(aggregate: Aggregate | string): string;
export declare function unaggregatedDomainWithLogScale(fieldDef: TypedFieldDef<string>): string;
export declare function cannotApplySizeToNonOrientedMark(mark: Mark): string;
export declare function scaleTypeNotWorkWithChannel(channel: Channel, scaleType: ScaleType, defaultScaleType: ScaleType): string;
export declare function scaleTypeNotWorkWithFieldDef(scaleType: ScaleType, defaultScaleType: ScaleType): string;
export declare function scalePropertyNotWorkWithScaleType(scaleType: ScaleType, propName: string, channel: Channel): string;
export declare function scaleTypeNotWorkWithMark(mark: Mark, scaleType: ScaleType): string;
export declare function stepDropped(channel: 'width' | 'height'): string;
export declare function mergeConflictingProperty<T>(property: string | number | symbol, propertyOf: SplitParentProperty, v1: T, v2: T): string;
export declare function mergeConflictingDomainProperty<T>(property: 'domains', propertyOf: SplitParentProperty, v1: T, v2: T): string;
export declare function independentScaleMeansIndependentGuide(channel: Channel): string;
export declare function domainSortDropped(sort: VgSortField): string;
export declare const UNABLE_TO_MERGE_DOMAINS = "Unable to merge domains.";
export declare const MORE_THAN_ONE_SORT = "Domains that should be unioned has conflicting sort properties. Sort will be set to true.";
export declare const INVALID_CHANNEL_FOR_AXIS = "Invalid channel for axis.";
export declare function cannotStackRangedMark(channel: Channel): string;
export declare function cannotStackNonLinearScale(scaleType: ScaleType): string;
export declare function stackNonSummativeAggregate(aggregate: Aggregate | string): string;
export declare function invalidTimeUnit(unitName: string, value: string | number): string;
export declare function dayReplacedWithDate(fullTimeUnit: string): string;
export declare function droppedDay(d: DateTime | DateTimeExpr): string;
export declare function errorBarCenterAndExtentAreNotNeeded(center: ErrorBarCenter, extent: ErrorBarExtent): string;
export declare function errorBarCenterIsUsedWithWrongExtent(center: ErrorBarCenter, extent: ErrorBarExtent, mark: 'errorbar' | 'errorband'): string;
export declare function errorBarContinuousAxisHasCustomizedAggregate(aggregate: Aggregate | string, compositeMark: CompositeMark): string;
export declare function errorBarCenterIsNotNeeded(extent: ErrorBarExtent, mark: 'errorbar' | 'errorband'): string;
export declare function errorBand1DNotSupport(property: 'interpolate' | 'tension'): string;
export declare function channelRequiredForBinned(channel: Channel): string;
export declare function domainRequiredForThresholdScale(channel: Channel): string;
//# sourceMappingURL=message.d.ts.map
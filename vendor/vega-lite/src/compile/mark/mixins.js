import { array, isArray, isObject, isString } from 'vega-util';
import { isBinned, isBinning } from '../../bin';
import { SCALE_CHANNELS, X, X2, Y2 } from '../../channel';
import { getTypedFieldDef, isConditionalSelection, isFieldDef, isValueDef } from '../../channeldef';
import * as log from '../../log';
import { isPathMark } from '../../mark';
import { hasContinuousDomain } from '../../scale';
import { contains, getFirstDefined, keys } from '../../util';
import { VG_MARK_CONFIGS } from '../../vega.schema';
import { getMarkConfig, getMarkPropOrConfig, getStyleConfig } from '../common';
import { expression } from '../predicate';
import { parseSelectionPredicate } from '../selection/parse';
import * as ref from './valueref';
import { fieldInvalidPredicate } from './valueref';
export function color(model) {
    const { markDef, encoding, config } = model;
    const { filled, type: markType } = markDef;
    const configValue = {
        fill: getMarkConfig('fill', markDef, config),
        stroke: getMarkConfig('stroke', markDef, config),
        color: getMarkConfig('color', markDef, config)
    };
    const transparentIfNeeded = contains(['bar', 'point', 'circle', 'square', 'geoshape'], markType)
        ? 'transparent'
        : undefined;
    const defaultFill = getFirstDefined(markDef.fill, filled === true ? markDef.color : undefined, configValue.fill, filled === true ? configValue.color : undefined, 
    // If there is no fill, always fill symbols, bar, geoshape
    // with transparent fills https://github.com/vega/vega-lite/issues/1316
    transparentIfNeeded);
    const defaultStroke = getFirstDefined(markDef.stroke, filled === false ? markDef.color : undefined, configValue.stroke, filled === false ? configValue.color : undefined);
    const colorVgChannel = filled ? 'fill' : 'stroke';
    const fillStrokeMarkDefAndConfig = Object.assign(Object.assign({}, (defaultFill ? { fill: { value: defaultFill } } : {})), (defaultStroke ? { stroke: { value: defaultStroke } } : {}));
    if (markDef.color && (filled ? markDef.fill : markDef.stroke)) {
        log.warn(log.message.droppingColor('property', { fill: 'fill' in markDef, stroke: 'stroke' in markDef }));
    }
    return Object.assign(Object.assign(Object.assign(Object.assign({}, fillStrokeMarkDefAndConfig), nonPosition('color', model, {
        vgChannel: colorVgChannel,
        defaultValue: filled ? defaultFill : defaultStroke
    })), nonPosition('fill', model, {
        // if there is encoding.fill, include default fill just in case we have conditional-only fill encoding
        defaultValue: encoding.fill ? defaultFill : undefined
    })), nonPosition('stroke', model, {
        // if there is encoding.stroke, include default fill just in case we have conditional-only stroke encoding
        defaultValue: encoding.stroke ? defaultStroke : undefined
    }));
}
export function baseEncodeEntry(model, ignore) {
    const { fill = undefined, stroke = undefined } = ignore.color === 'include' ? color(model) : {};
    return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, markDefProperties(model.markDef, ignore)), wrapAllFieldsInvalid(model, 'fill', fill)), wrapAllFieldsInvalid(model, 'stroke', stroke)), nonPosition('opacity', model)), nonPosition('fillOpacity', model)), nonPosition('strokeOpacity', model)), nonPosition('strokeWidth', model)), tooltip(model)), text(model, 'href'));
}
// TODO: mark VgValueRef[] as readonly after https://github.com/vega/vega/pull/1987
function wrapAllFieldsInvalid(model, channel, valueRef) {
    const { config, mark, markDef } = model;
    const invalid = getMarkPropOrConfig('invalid', markDef, config);
    if (invalid === 'hide' && valueRef && !isPathMark(mark)) {
        // For non-path marks, we have to exclude invalid values (null and NaN) for scales with continuous domains.
        // For path marks, we will use "defined" property and skip these values instead.
        const test = allFieldsInvalidPredicate(model, { invalid: true, channels: SCALE_CHANNELS });
        if (test) {
            return {
                [channel]: [
                    // prepend the invalid case
                    // TODO: support custom value
                    { test, value: null },
                    ...array(valueRef)
                ]
            };
        }
    }
    return valueRef ? { [channel]: valueRef } : {};
}
function markDefProperties(mark, ignore) {
    return VG_MARK_CONFIGS.reduce((m, prop) => {
        if (mark[prop] !== undefined && ignore[prop] !== 'ignore') {
            m[prop] = { value: mark[prop] };
        }
        return m;
    }, {});
}
export function valueIfDefined(prop, value) {
    if (value !== undefined) {
        return { [prop]: { value: value } };
    }
    return undefined;
}
function allFieldsInvalidPredicate(model, { invalid = false, channels }) {
    const filterIndex = channels.reduce((aggregator, channel) => {
        const scaleComponent = model.getScaleComponent(channel);
        if (scaleComponent) {
            const scaleType = scaleComponent.get('type');
            const field = model.vgField(channel, { expr: 'datum' });
            // While discrete domain scales can handle invalid values, continuous scales can't.
            if (field && hasContinuousDomain(scaleType)) {
                aggregator[field] = true;
            }
        }
        return aggregator;
    }, {});
    const fields = keys(filterIndex);
    if (fields.length > 0) {
        const op = invalid ? '||' : '&&';
        return fields.map(field => fieldInvalidPredicate(field, invalid)).join(` ${op} `);
    }
    return undefined;
}
export function defined(model) {
    const { config, markDef } = model;
    const invalid = getMarkPropOrConfig('invalid', markDef, config);
    if (invalid) {
        const signal = allFieldsInvalidPredicate(model, { channels: ['x', 'y'] });
        if (signal) {
            return { defined: { signal } };
        }
    }
    return {};
}
/**
 * Return mixins for non-positional channels with scales. (Text doesn't have scale.)
 */
export function nonPosition(channel, model, opt = {}) {
    const { markDef, encoding, config } = model;
    const { vgChannel = channel } = opt;
    let { defaultRef, defaultValue } = opt;
    if (defaultRef === undefined) {
        // prettier-ignore
        defaultValue = (defaultValue !== null && defaultValue !== void 0 ? defaultValue : (vgChannel === channel
            ? // When vl channel is the same as Vega's, no need to read from config as Vega will apply them correctly
                markDef[channel]
            : // However, when they are different (e.g, vl's text size is vg fontSize), need to read "size" from configs
                getFirstDefined(markDef[channel], markDef[vgChannel], getMarkConfig(channel, markDef, config, { vgChannel }))));
        defaultRef = defaultValue ? { value: defaultValue } : undefined;
    }
    const channelDef = encoding[channel];
    return wrapCondition(model, channelDef, vgChannel, cDef => {
        return ref.midPoint({
            channel,
            channelDef: cDef,
            markDef,
            config,
            scaleName: model.scaleName(channel),
            scale: model.getScaleComponent(channel),
            stack: null,
            defaultRef
        });
    });
}
/**
 * Return a mixin that includes a Vega production rule for a Vega-Lite conditional channel definition.
 * or a simple mixin if channel def has no condition.
 */
export function wrapCondition(model, channelDef, vgChannel, refFn) {
    const condition = channelDef && channelDef.condition;
    const valueRef = refFn(channelDef);
    if (condition) {
        const conditions = array(condition);
        const vgConditions = conditions.map(c => {
            const conditionValueRef = refFn(c);
            const test = isConditionalSelection(c) ? parseSelectionPredicate(model, c.selection) : expression(model, c.test);
            return Object.assign({ test }, conditionValueRef);
        });
        return {
            [vgChannel]: [...vgConditions, ...(valueRef !== undefined ? [valueRef] : [])]
        };
    }
    else {
        return valueRef !== undefined ? { [vgChannel]: valueRef } : {};
    }
}
export function tooltip(model, opt = {}) {
    const { encoding, markDef, config } = model;
    const channelDef = encoding.tooltip;
    if (isArray(channelDef)) {
        return { tooltip: ref.tooltipForEncoding({ tooltip: channelDef }, config, opt) };
    }
    else {
        return wrapCondition(model, channelDef, 'tooltip', cDef => {
            // use valueRef based on channelDef first
            const tooltipRefFromChannelDef = ref.text(cDef, model.config, opt.reactiveGeom ? 'datum.datum' : 'datum');
            if (tooltipRefFromChannelDef) {
                return tooltipRefFromChannelDef;
            }
            if (cDef === null) {
                // Allow using encoding.tooltip = null to disable tooltip
                return undefined;
            }
            // If tooltipDef does not exist, then use value from markDef or config
            let markTooltip = getFirstDefined(markDef.tooltip, getMarkConfig('tooltip', markDef, config));
            if (markTooltip === true) {
                markTooltip = { content: 'encoding' };
            }
            if (isString(markTooltip)) {
                return { value: markTooltip };
            }
            else if (isObject(markTooltip)) {
                // `tooltip` is `{fields: 'encodings' | 'fields'}`
                if (markTooltip.content === 'encoding') {
                    return ref.tooltipForEncoding(encoding, config, opt);
                }
                else {
                    return { signal: 'datum' };
                }
            }
            return undefined;
        });
    }
}
export function text(model, channel = 'text') {
    const channelDef = model.encoding[channel];
    return wrapCondition(model, channelDef, channel, cDef => ref.text(cDef, model.config));
}
export function bandPosition(fieldDef, channel, model, defaultSizeRef) {
    var _a;
    const scaleName = model.scaleName(channel);
    const sizeChannel = channel === 'x' ? 'width' : 'height';
    if (model.encoding.size != null || model.markDef.size != null || ((_a = defaultSizeRef) === null || _a === void 0 ? void 0 : _a.value) !== undefined) {
        const orient = model.markDef.orient;
        if (orient) {
            const centeredBandPositionMixins = {
                // Use xc/yc and place the mark at the middle of the band
                // This way we never have to deal with size's condition for x/y position.
                [channel + 'c']: ref.fieldRef(fieldDef, scaleName, {}, { band: 0.5 })
            };
            if (getTypedFieldDef(model.encoding.size)) {
                return Object.assign(Object.assign({}, centeredBandPositionMixins), nonPosition('size', model, { vgChannel: sizeChannel }));
            }
            else if (isValueDef(model.encoding.size)) {
                return Object.assign(Object.assign({}, centeredBandPositionMixins), nonPosition('size', model, { vgChannel: sizeChannel }));
            }
            else if (model.markDef.size !== undefined) {
                return Object.assign(Object.assign({}, centeredBandPositionMixins), { [sizeChannel]: { value: model.markDef.size } });
            }
            else if (defaultSizeRef && defaultSizeRef.value !== undefined) {
                return Object.assign(Object.assign({}, centeredBandPositionMixins), { [sizeChannel]: defaultSizeRef });
            }
        }
        else {
            log.warn(log.message.cannotApplySizeToNonOrientedMark(model.markDef.type));
        }
    }
    const { band = 1 } = fieldDef;
    return {
        // FIXME: make offset work correctly here when we support group bar (https://github.com/vega/vega-lite/issues/396)
        [channel]: ref.fieldRef(fieldDef, scaleName, { binSuffix: 'range' }, { band: (1 - band) / 2 }),
        [sizeChannel]: (defaultSizeRef !== null && defaultSizeRef !== void 0 ? defaultSizeRef : ref.bandRef(scaleName, band))
    };
}
export function centeredPointPositionWithSize(channel, model, defaultPosRef, defaultSizeRef) {
    const centerChannel = channel === 'x' ? 'xc' : 'yc';
    const sizeChannel = channel === 'x' ? 'width' : 'height';
    return Object.assign(Object.assign({}, pointPosition(channel, model, defaultPosRef, { vgChannel: centerChannel })), nonPosition('size', model, { defaultRef: defaultSizeRef, vgChannel: sizeChannel }));
}
export function binPosition({ fieldDef, fieldDef2, channel, band, scaleName, markDef, spacing = 0, reverse }) {
    const binSpacing = {
        x: reverse ? spacing : 0,
        x2: reverse ? 0 : spacing,
        y: reverse ? 0 : spacing,
        y2: reverse ? spacing : 0
    };
    const channel2 = channel === X ? X2 : Y2;
    if (isBinning(fieldDef.bin) || fieldDef.timeUnit) {
        return {
            [channel2]: ref.bin({
                channel,
                fieldDef,
                scaleName,
                markDef,
                band: (1 - band) / 2,
                offset: binSpacing[`${channel}2`]
            }),
            [channel]: ref.bin({
                channel,
                fieldDef,
                scaleName,
                markDef,
                band: 1 - (1 - band) / 2,
                offset: binSpacing[channel]
            })
        };
    }
    else if (isBinned(fieldDef.bin) && isFieldDef(fieldDef2)) {
        return {
            [channel2]: ref.fieldRef(fieldDef, scaleName, {}, { offset: binSpacing[`${channel}2`] }),
            [channel]: ref.fieldRef(fieldDef2, scaleName, {}, { offset: binSpacing[channel] })
        };
    }
    else {
        log.warn(log.message.channelRequiredForBinned(channel2));
        return undefined;
    }
}
/**
 * Return mixins for point (non-band) position channels.
 */
export function pointPosition(channel, model, defaultRef, { vgChannel } = {}) {
    // TODO: refactor how refer to scale as discussed in https://github.com/vega/vega-lite/pull/1613
    const { encoding, mark, markDef, config, stack } = model;
    const channelDef = encoding[channel];
    const channel2Def = encoding[channel === X ? X2 : Y2];
    const scaleName = model.scaleName(channel);
    const scale = model.getScaleComponent(channel);
    const offset = ref.getOffset(channel, model.markDef);
    const valueRef = !channelDef && (encoding.latitude || encoding.longitude)
        ? // use geopoint output if there are lat/long and there is no point position overriding lat/long.
            { field: model.getName(channel) }
        : ref.position({
            channel,
            channelDef,
            channel2Def,
            markDef,
            config,
            scaleName,
            scale,
            stack,
            offset,
            defaultRef: ref.positionDefault({
                markDef,
                config,
                defaultRef,
                channel,
                scaleName,
                scale,
                mark,
                checkBarAreaWithoutZero: !channel2Def // only check for non-ranged marks
            })
        });
    return {
        [(vgChannel !== null && vgChannel !== void 0 ? vgChannel : channel)]: valueRef
    };
}
const ALIGNED_X_CHANNEL = {
    left: 'x',
    center: 'xc',
    right: 'x2'
};
const BASELINED_Y_CHANNEL = {
    top: 'y',
    middle: 'yc',
    bottom: 'y2'
};
export function pointOrRangePosition(channel, model, { defaultRef, defaultRef2, range }) {
    if (range) {
        return rangePosition(channel, model, { defaultRef, defaultRef2 });
    }
    return pointPosition(channel, model, defaultRef);
}
export function rangePosition(channel, model, { defaultRef, defaultRef2 }) {
    const { markDef, config } = model;
    const channel2 = channel === 'x' ? 'x2' : 'y2';
    const sizeChannel = channel === 'x' ? 'width' : 'height';
    const pos2Mixins = pointPosition2(model, defaultRef2, channel2);
    const vgChannel = pos2Mixins[sizeChannel] ? alignedChannel(channel, markDef, config) : channel;
    return Object.assign(Object.assign({}, pointPosition(channel, model, defaultRef, { vgChannel })), pos2Mixins);
}
function alignedChannel(channel, markDef, config) {
    const alignChannel = channel === 'x' ? 'align' : 'baseline';
    const align = getFirstDefined(markDef[alignChannel], getMarkConfig(alignChannel, markDef, config));
    if (channel === 'x') {
        return ALIGNED_X_CHANNEL[(align !== null && align !== void 0 ? align : 'center')];
    }
    else {
        return BASELINED_Y_CHANNEL[(align !== null && align !== void 0 ? align : 'middle')];
    }
}
/**
 * Return mixins for x2, y2.
 * If channel is not specified, return one channel based on orientation.
 */
function pointPosition2(model, defaultRef, channel) {
    const { encoding, mark, markDef, stack, config } = model;
    const baseChannel = channel === 'x2' ? 'x' : 'y';
    const sizeChannel = channel === 'x2' ? 'width' : 'height';
    const channelDef = encoding[baseChannel];
    const scaleName = model.scaleName(baseChannel);
    const scale = model.getScaleComponent(baseChannel);
    const offset = ref.getOffset(channel, model.markDef);
    if (!channelDef && (encoding.latitude || encoding.longitude)) {
        // use geopoint output if there are lat2/long2 and there is no point position2 overriding lat2/long2.
        return { [channel]: { field: model.getName(channel) } };
    }
    const valueRef = ref.position2({
        channel,
        channelDef,
        channel2Def: encoding[channel],
        markDef,
        config,
        scaleName,
        scale,
        stack,
        offset,
        defaultRef: undefined
    });
    if (valueRef !== undefined) {
        return { [channel]: valueRef };
    }
    // TODO: check width/height encoding here once we add them
    // no x2/y2 encoding, then try to read x2/y2 or width/height based on precedence:
    // markDef > config.style > mark-specific config (config[mark]) > general mark config (config.mark)
    return getFirstDefined(position2orSize(channel, markDef), position2orSize(channel, {
        [channel]: getStyleConfig(channel, markDef, config.style),
        [sizeChannel]: getStyleConfig(sizeChannel, markDef, config.style)
    }), position2orSize(channel, config[mark]), position2orSize(channel, config.mark), {
        [channel]: ref.positionDefault({
            markDef,
            config,
            defaultRef,
            channel,
            scaleName,
            scale,
            mark,
            checkBarAreaWithoutZero: !encoding[channel] // only check for non-ranged marks
        })()
    });
}
function position2orSize(channel, markDef) {
    const sizeChannel = channel === 'x2' ? 'width' : 'height';
    if (markDef[channel]) {
        return { [channel]: ref.vgValueRef(channel, markDef[channel]) };
    }
    else if (markDef[sizeChannel]) {
        return { [sizeChannel]: { value: markDef[sizeChannel] } };
    }
    return undefined;
}
//# sourceMappingURL=mixins.js.map
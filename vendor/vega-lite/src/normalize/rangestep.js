import { __rest } from "tslib";
import { getSizeType, POSITION_SCALE_CHANNELS } from '../channel';
import { isFieldDef } from '../channeldef';
import * as log from '../log';
import { isUnitSpec } from '../spec/unit';
import { keys } from '../util';
export class RangeStepNormalizer {
    constructor() {
        this.name = 'RangeStep';
    }
    hasMatchingType(spec) {
        var _a, _b;
        if (isUnitSpec(spec) && spec.encoding) {
            for (const channel of POSITION_SCALE_CHANNELS) {
                const def = spec.encoding[channel];
                if (def && isFieldDef(def)) {
                    if ((_b = (_a = def) === null || _a === void 0 ? void 0 : _a.scale) === null || _b === void 0 ? void 0 : _b['rangeStep']) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    run(spec) {
        var _a, _b;
        const sizeMixins = {};
        let encoding = Object.assign({}, spec.encoding);
        for (const channel of POSITION_SCALE_CHANNELS) {
            const sizeType = getSizeType(channel);
            const def = encoding[channel];
            if (def && isFieldDef(def)) {
                if ((_b = (_a = def) === null || _a === void 0 ? void 0 : _a.scale) === null || _b === void 0 ? void 0 : _b['rangeStep']) {
                    const { scale } = def, defWithoutScale = __rest(def, ["scale"]);
                    const _c = scale, { rangeStep } = _c, scaleWithoutRangeStep = __rest(_c, ["rangeStep"]);
                    sizeMixins[sizeType] = { step: scale['rangeStep'] };
                    log.warn(log.message.RANGE_STEP_DEPRECATED);
                    encoding = Object.assign(Object.assign({}, encoding), { [channel]: Object.assign(Object.assign({}, defWithoutScale), (keys(scaleWithoutRangeStep).length ? { scale: scaleWithoutRangeStep } : {})) });
                }
            }
        }
        return Object.assign(Object.assign(Object.assign({}, sizeMixins), spec), { encoding });
    }
}
//# sourceMappingURL=rangestep.js.map
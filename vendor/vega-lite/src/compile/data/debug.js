import { entries, uniqueId } from './../../util';
import { OutputNode } from './dataflow';
import { SourceNode } from './source';
/**
 * Print debug information for dataflow tree.
 */
export function debug(node) {
    console.log(`${node.constructor.name}${node.debugName ? `(${node.debugName})` : ''} -> ${node.children.map(c => {
        return `${c.constructor.name}${c.debugName ? ` (${c.debugName})` : ''}`;
    })}`);
    console.log(node);
    node.children.forEach(debug);
}
/**
 * Print the dataflow tree as graphviz.
 *
 * Render the output in http://viz-js.com/.
 */
export function draw(roots) {
    // check the graph before printing it since the logic below assumes a consistent graph
    checkLinks(roots);
    const nodes = {};
    const edges = [];
    function getId(node) {
        let id = node['__uniqueid'];
        if (id === undefined) {
            id = uniqueId();
            node['__uniqueid'] = id;
        }
        return id;
    }
    function getLabel(node) {
        var _a, _b, _c;
        const out = [node.constructor.name.slice(0, -4)];
        if (node.debugName) {
            out.push(`<i>${node.debugName}</i>`);
        }
        else if (node instanceof SourceNode) {
            if (node.data.name || node.data.url) {
                out.push(`<i>${_a = node.data.name, (_a !== null && _a !== void 0 ? _a : node.data.url)}</i>`);
            }
        }
        const dep = node.dependentFields();
        if ((_b = dep) === null || _b === void 0 ? void 0 : _b.size) {
            out.push(`<font color="grey" point-size="10">IN:</font> ${[...node.dependentFields()].join(', ')}`);
        }
        const prod = node.producedFields();
        if ((_c = prod) === null || _c === void 0 ? void 0 : _c.size) {
            out.push(`<font color="grey" point-size="10">OUT:</font> ${[...node.producedFields()].join(', ')}`);
        }
        if (node instanceof OutputNode) {
            out.push(`<font color="grey" point-size="10">required:</font> ${node.isRequired()}`);
        }
        return out.join('<br/>');
    }
    function collector(node) {
        var _a, _b;
        const id = getId(node);
        nodes[id] = {
            id: id,
            label: getLabel(node),
            hash: node instanceof SourceNode
                ? (_b = (_a = node.data.url, (_a !== null && _a !== void 0 ? _a : node.data.name)), (_b !== null && _b !== void 0 ? _b : node.debugName)) : String(node.hash()).replace(/"/g, '')
        };
        for (const child of node.children) {
            edges.push([id, getId(child)]);
            collector(child);
        }
    }
    roots.forEach(n => collector(n));
    const dot = `digraph DataFlow {
  rankdir = TB;
  node [shape=record]
  ${entries(nodes)
        .map(({ key, value }) => `  "${key}" [
    label = <${value.label}>;
    tooltip = "[${value.id}]&#010;${value.hash}"
  ]`)
        .join('\n')}

  ${edges.map(([source, target]) => `"${source}" -> "${target}"`).join(' ')}
}`;
    console.log(dot);
    return dot;
}
/**
 * Iterates over a dataflow graph and checks whether all links are consistent.
 */
export function checkLinks(nodes) {
    for (const node of nodes) {
        for (const child of node.children) {
            if (child.parent !== node) {
                console.error('Dataflow graph is inconsistent.', node, child);
                return false;
            }
        }
        if (!checkLinks(node.children)) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=debug.js.map
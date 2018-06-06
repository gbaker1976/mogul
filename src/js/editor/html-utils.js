export class HtmlUtils {
	static contentCategoriesForNode(node) {
		const tags = {
			'a': {model: 'transparent'},
			'p': {model: 'phrasing'}
		};

		return tags[node.nodeName.toLowercase()];
	}

	static allowedContent(node, contained) {
		let context = 'flow';
		const traverseChildNodes = (n, f) => {
			f(n);
			n.childNodes.forEach(c => traverseChildNodes(c, f));
		};

		traverseChildNodes(contained, c => console.log(`${c.nodeName}`));

		return false;
	}

	static replace(nodeToReplace, ...nodes) {
		const parent = nodeToReplace.parentElement;

		nodes.forEach(n => {
			parent.insertBefore(n, nodeToReplace);
		});

		parent.removeChild(nodeToReplace);
	}

	static splitNode(node, offset) {
		if (node && offset > -1) {
			switch (node.nodeType) {
				case 1 : // element

					break;
				case 3 : // text
					return [node, node.splitText(offset)];
					break;
				case 4 : // comment
				case 8 : // cdata
			}
		}
	}

	static splitNodeByRange(node, range) {
		let nodes = HtmlUtils.splitNode(node, range.endOffset);
		nodes.splice(0, 0, ...HtmlUtils.splitNode(nodes.shift(), range.startOffset));
		return nodes;
	}

	static iterateNodes(nodes, callback, deep = false) {
		nodes.forEach(n => {
			callback(n);
			if (deep && n.childNodes) {
				HtmlUtils.iterateNodes(n.childNodes, callback, deep);
			}
		});
	}

	static concatNodes(...args /* last arg deep = true|false */) {
		let newNode = document.createTextNode('');
		let deep = (typeof args[args.length-1] === 'boolean');

		if (deep) args.pop();

		HtmlUtils.iterateNodes(args, n => {newNode.nodeValue += n.nodeValue}, deep);

		return newNode;
	}
}

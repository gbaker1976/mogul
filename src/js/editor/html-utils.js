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
}
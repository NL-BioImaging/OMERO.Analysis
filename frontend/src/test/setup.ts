import "@testing-library/jest-dom";
import "fake-indexeddb/auto";

// jsdom has no layout engine; browser acceptance verifies actual editor geometry.
Range.prototype.getClientRects ??= () => [] as unknown as DOMRectList;
Range.prototype.getBoundingClientRect ??= () => new DOMRect();

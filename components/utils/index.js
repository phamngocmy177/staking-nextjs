import { addIndex, map, replace } from "ramda";

export const mapIndexed = addIndex(map);

export const replaceWhiteSpaces = replace(/\s/g, "-");

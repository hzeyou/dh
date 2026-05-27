import _upperFirst from "lodash/upperFirst";
import _camelCase from "lodash/camelCase";
export const handleCode = (value, extendFieldPrefixRule) => {
  return extendFieldPrefixRule ? _upperFirst(_camelCase(value)) : _camelCase(value);
};
import { StoredMap } from "../stored-map.js";
export class StoredMapSerializer {
    serialize(value) {
        if (value instanceof StoredMap) {
            return [value.path];
        }
    }
    deserialize(args) {
        return new StoredMap(args[0]);
    }
}

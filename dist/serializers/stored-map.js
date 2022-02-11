import { StoredMap } from "../stored-map.js";
export class StoredMapSerializer {
    serialize(value) {
        // If the value is an instance of StoredMap, return the path of the object.
        if (value instanceof StoredMap) {
            return [value.path];
        }
    }
    deserialize(args) {
        // Construct a new StoredMap object from the path.
        return new StoredMap(args[0]);
    }
}

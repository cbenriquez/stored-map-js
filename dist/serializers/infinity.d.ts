import { Serializer } from "../stored-map-converter";
export declare class InfinitySerializer implements Serializer {
    serialize(value: any): never[] | undefined;
    deserialize(): number;
}

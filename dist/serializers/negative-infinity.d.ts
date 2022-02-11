import { Serializer } from "../stored-map-converter";
export declare class NegativeInfinitySerializer implements Serializer {
    serialize(value: any): never[] | undefined;
    deserialize(): number;
}

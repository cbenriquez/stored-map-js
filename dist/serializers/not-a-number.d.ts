import { Serializer } from "../stored-map-converter";
export declare class NotANumberSerializer implements Serializer {
    serialize(value: any): never[] | undefined;
    deserialize(): number;
}

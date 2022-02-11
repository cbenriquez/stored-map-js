import { Serializer } from "../stored-map-converter";
export declare class UndefinedSerializer implements Serializer {
    serialize(value: any): never[] | undefined;
    deserialize(): undefined;
}

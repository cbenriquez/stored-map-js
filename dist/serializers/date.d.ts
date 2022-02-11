import { Serializer } from "../stored-map-converter";
export declare type DateSerialized = [number];
export declare class DateSerializer implements Serializer {
    serialize(value: any): DateSerialized | undefined;
    deserialize(args: DateSerialized): Date;
}

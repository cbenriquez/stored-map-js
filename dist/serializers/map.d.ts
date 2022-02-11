export declare type MapSerialized = [[any, any][]];
export declare namespace MapSerializer {
    function serializer(value: any): MapSerialized | undefined;
    function deserialize(args: MapSerialized): Map<any, any>;
}

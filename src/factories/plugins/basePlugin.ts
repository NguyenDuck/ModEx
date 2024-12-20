export abstract class BasePlugin<T> {
    abstract run(obj: T): Promise<void>;
}
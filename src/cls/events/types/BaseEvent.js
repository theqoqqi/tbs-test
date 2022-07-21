
export default class BaseEvent {

    static get eventName() {
        throw new Error('Event name is not set');
    }
}
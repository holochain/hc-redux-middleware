"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const sinon_1 = __importDefault(require("sinon"));
const middleware_1 = require("./middleware");
const actionCreator_1 = require("./actionCreator");
const mockWebClient = Promise.resolve({
    call: (callStr) => (params) => {
        return Promise.resolve(JSON.stringify('success'));
    },
    close: () => Promise.resolve('closed'),
    ws: null
});
const create = () => {
    const store = {
        getState: sinon_1.default.spy(() => ({})),
        dispatch: sinon_1.default.spy()
    };
    const next = sinon_1.default.spy();
    const invoke = (action) => middleware_1.holochainMiddleware(mockWebClient)(store)(next)(action);
    return { store, next, invoke };
};
ava_1.default('It passes non-holochain actions to the next reducer', async (t) => {
    let { next, invoke } = create();
    const nonHolochainAction = { type: 'not-holochain-action' };
    await invoke(nonHolochainAction);
    t.true(next.calledWith(nonHolochainAction));
});
ava_1.default('It passes holochain actions and dispatches new action on success ', async (t) => {
    let { next, invoke, store } = create();
    const holochainAction = actionCreator_1.createHolochainAsyncAction('happ', 'zome', 'capability', 'func');
    await invoke(holochainAction.create({}));
    t.true(next.calledWith(holochainAction.create({})));
    t.true(store.dispatch.calledWith(holochainAction.success('success')));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlkZGxld2FyZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9taWRkbGV3YXJlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw4Q0FBc0I7QUFDdEIsa0RBQXlCO0FBRXpCLDZDQUFrRDtBQUNsRCxtREFBNEQ7QUFFNUQsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUNwQyxJQUFJLEVBQUUsQ0FBQyxPQUFlLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBVyxFQUFFLEVBQUU7UUFDekMsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQTtJQUNuRCxDQUFDO0lBQ0QsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO0lBQ3RDLEVBQUUsRUFBRSxJQUFJO0NBQ1QsQ0FBQyxDQUFBO0FBRUYsTUFBTSxNQUFNLEdBQUcsR0FBRyxFQUFFO0lBQ2xCLE1BQU0sS0FBSyxHQUFHO1FBQ1osUUFBUSxFQUFFLGVBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMvQixRQUFRLEVBQUUsZUFBSyxDQUFDLEdBQUcsRUFBRTtLQUN0QixDQUFBO0lBQ0QsTUFBTSxJQUFJLEdBQUcsZUFBSyxDQUFDLEdBQUcsRUFBRSxDQUFBO0lBQ3hCLE1BQU0sTUFBTSxHQUFHLENBQUMsTUFBVyxFQUFFLEVBQUUsQ0FBQyxnQ0FBbUIsQ0FBQyxhQUFhLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUV2RixPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQTtBQUNoQyxDQUFDLENBQUE7QUFFRCxhQUFJLENBQUMscURBQXFELEVBQUUsS0FBSyxFQUFDLENBQUMsRUFBQyxFQUFFO0lBQ3BFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsTUFBTSxFQUFFLENBQUE7SUFFL0IsTUFBTSxrQkFBa0IsR0FBRyxFQUFFLElBQUksRUFBRSxzQkFBc0IsRUFBRSxDQUFBO0lBQzNELE1BQU0sTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUE7SUFFaEMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQTtBQUM3QyxDQUFDLENBQUMsQ0FBQTtBQUVGLGFBQUksQ0FBQyxtRUFBbUUsRUFBRSxLQUFLLEVBQUMsQ0FBQyxFQUFDLEVBQUU7SUFDbEYsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsTUFBTSxFQUFFLENBQUE7SUFFdEMsTUFBTSxlQUFlLEdBQUcsMENBQTBCLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxDQUFDLENBQUE7SUFDeEYsTUFBTSxNQUFNLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBRXhDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNuRCxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBRXZFLENBQUMsQ0FBQyxDQUFBIn0=
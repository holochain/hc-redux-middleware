import { createAsyncAction } from 'typesafe-actions';
/**
 *
 * Function that creates action creators for holochain calls
 * The actions it creates are thunks rather than traditional actions
 * so the redux-thunk middleware must be applied.
 *
 */
export const createHolochainAsyncAction = (happ, zome, capability, func) => {
    const callString = `${happ}/${zome}/${capability}/${func}`;
    const action = createAsyncAction(callString, callString + '_SUCCESS', callString + '_FAILURE')();
    const newAction = action;
    // the action creators that are produced
    newAction.create = (params) => {
        return {
            type: callString,
            meta: {
                holochainAction: true,
                callString
            },
            payload: params
        };
    };
    return newAction;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9uQ3JlYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvYWN0aW9uQ3JlYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQTtBQUVwRDs7Ozs7O0dBTUc7QUFDSCxNQUFNLENBQUMsTUFBTSwwQkFBMEIsR0FBRyxDQUN4QyxJQUFZLEVBQ1osSUFBWSxFQUNaLFVBQWtCLEVBQ2xCLElBQVksRUFDWixFQUFFO0lBRUYsTUFBTSxVQUFVLEdBQUcsR0FBRyxJQUFJLElBQUksSUFBSSxJQUFJLFVBQVUsSUFBSSxJQUFJLEVBQUUsQ0FBQTtJQUUxRCxNQUFNLE1BQU0sR0FBRyxpQkFBaUIsQ0FDOUIsVUFBVSxFQUNWLFVBQVUsR0FBRyxVQUFVLEVBQ3ZCLFVBQVUsR0FBRyxVQUFVLENBQUMsRUFDTSxDQUFBO0lBRWhDLE1BQU0sU0FBUyxHQUFHLE1BR2hCLENBQUE7SUFFRix3Q0FBd0M7SUFDeEMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLE1BQWlCLEVBQUUsRUFBRTtRQUN2QyxPQUFPO1lBQ0wsSUFBSSxFQUFFLFVBQVU7WUFDaEIsSUFBSSxFQUFFO2dCQUNKLGVBQWUsRUFBRSxJQUFJO2dCQUNyQixVQUFVO2FBQ1g7WUFDRCxPQUFPLEVBQUUsTUFBTTtTQUNoQixDQUFBO0lBQ0gsQ0FBQyxDQUFBO0lBRUQsT0FBTyxTQUFTLENBQUE7QUFDbEIsQ0FBQyxDQUFBIn0=
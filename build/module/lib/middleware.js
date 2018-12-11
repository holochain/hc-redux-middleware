export const holochainMiddleware = (hcWc) => store => {
    // stuff here has the same life as the store!
    // this is how we persist a websocket connection
    const connectPromise = hcWc.then(({ call }) => {
        store.dispatch({ type: 'HOLOCHAIN_WEBSOCKET_CONNECTED' });
        return call;
    });
    return next => (action) => {
        if (action.meta && action.meta.holochainAction && action.meta.callString) {
            next(action); // resend the original action so the UI can change based on requests
            return connectPromise.then(call => {
                return call(action.meta.callString)(action.payload)
                    .then((stringResult) => {
                    const result = JSON.parse(stringResult);
                    if (result.Err !== undefined) { // holochain error
                        store.dispatch({
                            type: action.type + '_FAILURE',
                            payload: Error(result.Err)
                        });
                        return Error(result.Err);
                    }
                    else if (result.Ok !== undefined) { // holochain Ok
                        store.dispatch({
                            type: action.type + '_SUCCESS',
                            payload: result.Ok
                        });
                        return result.Ok;
                    }
                    else { // unknown. Return raw result as success
                        store.dispatch({
                            type: action.type + '_SUCCESS',
                            payload: result
                        });
                        return result;
                    }
                })
                    .catch((err) => {
                    store.dispatch({
                        type: action.type + '_FAILURE',
                        payload: err.toString()
                    });
                    return err;
                });
            });
        }
        else {
            return next(action);
        }
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlkZGxld2FyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvbWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRQSxNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLElBQXdCLEVBQWMsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFO0lBQ25GLDZDQUE2QztJQUM3QyxnREFBZ0Q7SUFFaEQsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRTtRQUM1QyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFFLCtCQUErQixFQUFFLENBQUMsQ0FBQTtRQUN6RCxPQUFPLElBQUksQ0FBQTtJQUNiLENBQUMsQ0FBQyxDQUFBO0lBRUYsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBaUIsRUFBRSxFQUFFO1FBQ25DLElBQUksTUFBTSxDQUFDLElBQUksSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUN4RSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUEsQ0FBQyxvRUFBb0U7WUFFakYsT0FBTyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNoQyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7cUJBQ2hELElBQUksQ0FBQyxDQUFDLFlBQW9CLEVBQUUsRUFBRTtvQkFDN0IsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQTtvQkFFdkMsSUFBSSxNQUFNLENBQUMsR0FBRyxLQUFLLFNBQVMsRUFBRSxFQUFFLGtCQUFrQjt3QkFDaEQsS0FBSyxDQUFDLFFBQVEsQ0FBQzs0QkFDYixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksR0FBRyxVQUFVOzRCQUM5QixPQUFPLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7eUJBQzNCLENBQUMsQ0FBQTt3QkFDRixPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7cUJBQ3pCO3lCQUFNLElBQUksTUFBTSxDQUFDLEVBQUUsS0FBSyxTQUFTLEVBQUUsRUFBRSxlQUFlO3dCQUNuRCxLQUFLLENBQUMsUUFBUSxDQUFDOzRCQUNiLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxHQUFHLFVBQVU7NEJBQzlCLE9BQU8sRUFBRSxNQUFNLENBQUMsRUFBRTt5QkFDbkIsQ0FBQyxDQUFBO3dCQUNGLE9BQU8sTUFBTSxDQUFDLEVBQUUsQ0FBQTtxQkFDakI7eUJBQU0sRUFBa0Isd0NBQXdDO3dCQUMvRCxLQUFLLENBQUMsUUFBUSxDQUFDOzRCQUNiLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxHQUFHLFVBQVU7NEJBQzlCLE9BQU8sRUFBRSxNQUFNO3lCQUNoQixDQUFDLENBQUE7d0JBQ0YsT0FBTyxNQUFNLENBQUE7cUJBQ2Q7Z0JBQ0gsQ0FBQyxDQUFDO3FCQUNELEtBQUssQ0FBQyxDQUFDLEdBQVUsRUFBRSxFQUFFO29CQUNwQixLQUFLLENBQUMsUUFBUSxDQUFDO3dCQUNiLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxHQUFHLFVBQVU7d0JBQzlCLE9BQU8sRUFBRSxHQUFHLENBQUMsUUFBUSxFQUFFO3FCQUN4QixDQUFDLENBQUE7b0JBQ0YsT0FBTyxHQUFHLENBQUE7Z0JBQ1osQ0FBQyxDQUFDLENBQUE7WUFDTixDQUFDLENBQUMsQ0FBQTtTQUNIO2FBQU07WUFDTCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtTQUNwQjtJQUNILENBQUMsQ0FBQTtBQUNILENBQUMsQ0FBQSJ9
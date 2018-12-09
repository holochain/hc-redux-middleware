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
                    return store.dispatch({
                        type: action.type + '_SUCCESS',
                        payload: result
                    });
                })
                    .catch((err) => {
                    return store.dispatch({
                        type: action.type + '_FAILURE',
                        payload: err.toString(),
                        error: true
                    });
                });
            });
        }
        else {
            return next(action);
        }
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlkZGxld2FyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvbWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRQSxNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLElBQXdCLEVBQWMsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFO0lBQ25GLDZDQUE2QztJQUM3QyxnREFBZ0Q7SUFFaEQsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRTtRQUM1QyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFFLCtCQUErQixFQUFFLENBQUMsQ0FBQTtRQUN6RCxPQUFPLElBQUksQ0FBQTtJQUNiLENBQUMsQ0FBQyxDQUFBO0lBRUYsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBaUIsRUFBRSxFQUFFO1FBQ25DLElBQUksTUFBTSxDQUFDLElBQUksSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUN4RSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUEsQ0FBQyxvRUFBb0U7WUFFakYsT0FBTyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNoQyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7cUJBQ2hELElBQUksQ0FBQyxDQUFDLFlBQW9CLEVBQUUsRUFBRTtvQkFDN0IsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQTtvQkFDdkMsT0FBTyxLQUFLLENBQUMsUUFBUSxDQUFDO3dCQUNwQixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksR0FBRyxVQUFVO3dCQUM5QixPQUFPLEVBQUUsTUFBTTtxQkFDaEIsQ0FBQyxDQUFBO2dCQUNKLENBQUMsQ0FBQztxQkFDRCxLQUFLLENBQUMsQ0FBQyxHQUFVLEVBQUUsRUFBRTtvQkFDcEIsT0FBTyxLQUFLLENBQUMsUUFBUSxDQUFDO3dCQUNwQixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksR0FBRyxVQUFVO3dCQUM5QixPQUFPLEVBQUUsR0FBRyxDQUFDLFFBQVEsRUFBRTt3QkFDdkIsS0FBSyxFQUFFLElBQUk7cUJBQ1osQ0FBQyxDQUFBO2dCQUNKLENBQUMsQ0FBQyxDQUFBO1lBQ04sQ0FBQyxDQUFDLENBQUE7U0FDSDthQUFNO1lBQ0wsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7U0FDcEI7SUFDSCxDQUFDLENBQUE7QUFDSCxDQUFDLENBQUEifQ==
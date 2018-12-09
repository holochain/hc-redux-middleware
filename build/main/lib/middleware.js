"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.holochainMiddleware = (hcWc) => store => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlkZGxld2FyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvbWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVFhLFFBQUEsbUJBQW1CLEdBQUcsQ0FBQyxJQUF3QixFQUFjLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRTtJQUNuRiw2Q0FBNkM7SUFDN0MsZ0RBQWdEO0lBRWhELE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7UUFDNUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUksRUFBRSwrQkFBK0IsRUFBRSxDQUFDLENBQUE7UUFDekQsT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDLENBQUMsQ0FBQTtJQUVGLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQWlCLEVBQUUsRUFBRTtRQUNuQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDeEUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBLENBQUMsb0VBQW9FO1lBRWpGLE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDaEMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO3FCQUNoRCxJQUFJLENBQUMsQ0FBQyxZQUFvQixFQUFFLEVBQUU7b0JBQzdCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUE7b0JBQ3ZDLE9BQU8sS0FBSyxDQUFDLFFBQVEsQ0FBQzt3QkFDcEIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsVUFBVTt3QkFDOUIsT0FBTyxFQUFFLE1BQU07cUJBQ2hCLENBQUMsQ0FBQTtnQkFDSixDQUFDLENBQUM7cUJBQ0QsS0FBSyxDQUFDLENBQUMsR0FBVSxFQUFFLEVBQUU7b0JBQ3BCLE9BQU8sS0FBSyxDQUFDLFFBQVEsQ0FBQzt3QkFDcEIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsVUFBVTt3QkFDOUIsT0FBTyxFQUFFLEdBQUcsQ0FBQyxRQUFRLEVBQUU7d0JBQ3ZCLEtBQUssRUFBRSxJQUFJO3FCQUNaLENBQUMsQ0FBQTtnQkFDSixDQUFDLENBQUMsQ0FBQTtZQUNOLENBQUMsQ0FBQyxDQUFBO1NBQ0g7YUFBTTtZQUNMLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1NBQ3BCO0lBQ0gsQ0FBQyxDQUFBO0FBQ0gsQ0FBQyxDQUFBIn0=
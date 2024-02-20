
export const load = async ({ fetch }) => {
    const response = await fetch('/api/dinner');
    if (response.ok) {
        const data = await response.json();
        return {
            response : data
        }
    }
    else {
        return {
            status: response.status,
            error: new Error("Failed to fetch data")
        };
    }
}

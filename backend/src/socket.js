export function handleSocket(io) {
    io.on("connection", (socket) => {
        console.log("user connected:", socket.id);

        socket.on("disconnect", () => {
            console.group("user disconnected:", socket.id);
        });
    });
}
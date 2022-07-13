import {app} from "./app";

const port = process.env.PORT || 7777;
app.listen(port, function () {
    console.log(`Example app listening on port http://localhost:${port}!`);
})